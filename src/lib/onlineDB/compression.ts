export interface Change {
    id?: number,
    type: "creating" | "updating" | "deleting",
    table: string,
    timestamp: Date,
    db_ID: number
}



export async function compressWithStream(
    data: string,
    format: 'gzip' | 'deflate' | 'deflate-raw'
): Promise<Uint8Array> {
    const encoder = new TextEncoder();
    const input = encoder.encode(data);
    const originalSize = input.byteLength;
    console.log(`Original Size: ${originalSize} bytes`);

    const stream = new CompressionStream(format);
    const writer = stream.writable.getWriter();
    writer.write(input);
    writer.close();

    const compressedChunks: Uint8Array[] = [];
    const reader = stream.readable.getReader();
    let totalCompressedSize = 0;

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        compressedChunks.push(value);
        totalCompressedSize += value.byteLength;
    }

    console.log(`${format.toUpperCase()} Compressed Size: ${totalCompressedSize} bytes`);
    return new Uint8Array(compressedChunks.reduce((acc, chunk) => [...acc, ...chunk], []));
}

export async function decompressWithStream(
    compressedData: Uint8Array,
    format: 'gzip' | 'deflate' | 'deflate-raw'
): Promise<string> {
    const stream = new DecompressionStream(format);
    const writer = stream.writable.getWriter();
    writer.write(compressedData);
    writer.close();

    const decompressedChunks: Uint8Array[] = [];
    const reader = stream.readable.getReader();
    let totalDecompressedSize = 0;

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        decompressedChunks.push(value);
        totalDecompressedSize += value.byteLength;
    }

    console.log(`${format.toUpperCase()} Decompressed Size: ${totalDecompressedSize} bytes`);
    const decoder = new TextDecoder();
    return decoder.decode(
        new Uint8Array(decompressedChunks.reduce((acc, chunk) => [...acc, ...chunk], []))
    );
}

export function downloadJSON(object: any, filename: string) {
    const jsonStr = JSON.stringify(object, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export function getByteSize(str: string): number {
    const encoder = new TextEncoder();
    const encoded = encoder.encode(str);
    return encoded.byteLength;
}
export type CombinedChanges = {
    creating: Change[];
    updating: Change[];
    deleting: Change[];
    filtered_IDs?: number[];
    deleted_IDs?: number[];
};

export function filterchanges(changesArray: Change[]): Record<string, CombinedChanges> {
    const combinedChanges = changesArray.reduce(
        (acc, change) => {
            if (!acc[change.table]) {
                acc[change.table] = {
                    creating: [],
                    updating: [],
                    deleting: []
                };
            }
            acc[change.table][change.type].push(change);
            return acc;
        },
        {} as Record<string, { creating: Change[]; updating: Change[]; deleting: Change[] }>
    );

    console.log(combinedChanges);
    return combinedChanges;
}

export function processChanges(changesArray: Change[]) {
    const combinedChanges = filterchanges(changesArray);

    for (const table in combinedChanges) {
        const creatingAndUpdatingIDs = new Set<number>();
        const deletedIDs = new Set<number>();

        combinedChanges[table].creating.forEach((change) => creatingAndUpdatingIDs.add(change.db_ID));
        combinedChanges[table].updating.forEach((change) => creatingAndUpdatingIDs.add(change.db_ID));

        combinedChanges[table].deleting.forEach((change) => {
            creatingAndUpdatingIDs.delete(change.db_ID);
            deletedIDs.add(change.db_ID);
        });

        combinedChanges[table].filtered_IDs = Array.from(creatingAndUpdatingIDs);
        combinedChanges[table].deleted_IDs = Array.from(deletedIDs);
    }

    return combinedChanges;
}

export async function getProcessedData(changesArray: Change[], db: any) {
    const combinedChanges = processChanges(changesArray);
    const result = [];

    for (const table in combinedChanges) {
        const { filtered_IDs, deleted_IDs } = combinedChanges[table];

        if (filtered_IDs && filtered_IDs.length > 0) {
            // Fetch data from the database for filtered_IDs
            const updated_data = await db[table].where('id').anyOf(filtered_IDs).toArray();

            // Get the latest timestamp from the updating changes

            result.push({
                tablename: table,
                filtered_ID: filtered_IDs,
                updated_data,
                delete_IDs: deleted_IDs || [],
                timestamp: new Date().getTime()
            });
        }
    }

    return result;
}
