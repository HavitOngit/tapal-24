import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { decompressWithStream } from '$lib/onlineDB/compression';


export const GET: RequestHandler = async () => {
    return new Response();
};

export const POST: RequestHandler = async (event) => {
    const session = await event.locals.auth()
    if (!session?.user?.email) {
        return new Response(null, { status: 401, statusText: "Unauthorized" })
    }

    const request = event.request;
    const { data } = await request.json();
    const fdata = Object.values(data);
    const unit8Array = new Uint8Array(fdata);
    const decompresed = await decompressWithStream(unit8Array, 'gzip');
    const decomObj = JSON.parse(decompresed);

    // console.log(decompressedData);



    return json({ session: session.user.email, request: decomObj });
}