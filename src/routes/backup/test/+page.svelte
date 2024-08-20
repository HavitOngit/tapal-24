<script lang="ts">
	import { liveQuery } from 'dexie';
	import type { PageData } from './$types';
	import { changesDB } from '$lib/changesDB';
	import { onMount } from 'svelte';

	export let data: PageData;

	const allChanges = liveQuery(() => changesDB.changes.toArray());

	async function compressWithStream(
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

	async function decompressWithStream(
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

	function downloadJSON(object: any, filename: string) {
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

	function getByteSize(str: string): number {
		const encoder = new TextEncoder();
		const encoded = encoder.encode(str);
		return encoded.byteLength;
	}
	// Example usage
	onMount(async () => {
		const staticallchanges = await changesDB.changes.toArray();
		const exampleData = JSON.stringify(staticallchanges);

		const compressedGzip = await compressWithStream(exampleData, 'gzip');
		const decompressedGzip = await decompressWithStream(compressedGzip, 'gzip');
		console.log('original-' + getByteSize(exampleData));

		console.log('compressed-' + compressedGzip.byteLength);
		console.log('decompressed-' + getByteSize(decompressedGzip));

		// Download the changes as a JSON file
		downloadJSON(JSON.parse(decompressedGzip), 'degzip.json');
	});
</script>
