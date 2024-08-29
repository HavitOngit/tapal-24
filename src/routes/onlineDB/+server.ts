import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { decompressWithStream } from '$lib/onlineDB/compression';
import { drizzle } from 'drizzle-orm/libsql';
import { client } from '$lib/onlineDB/onlineDB';
import { user } from '$lib/onlineDB/schema';
import * as schema from '$lib/onlineDB/schema';
import { eq } from 'drizzle-orm';


export const GET: RequestHandler = async () => {
    return new Response();
};

export const POST: RequestHandler = async (event) => {
    const session = await event.locals.auth()
    if (!session?.user?.email) {
        return new Response(null, { status: 401, statusText: "Unauthorized" })
    }

    const DB = drizzle(client(), { schema });
    const userid = await DB.select().from(user).where(eq(user.email, session.user.email));
    if (userid.length === 0) {
        await DB.insert(user).values({ email: session.user.email, name: session.user.name, image: session.user.image, schoolId: 1 });

    }
    const request = event.request;
    const { data } = await request.json();
    const fdata = Object.values(data);
    const unit8Array = new Uint8Array(fdata);
    const decompresed = await decompressWithStream(unit8Array, 'gzip');
    const decomObj = JSON.parse(decompresed);

    // console.log(decompressedData);



    return json({ session: session.user.email, request: userid });
}