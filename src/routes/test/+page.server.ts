import type { PageServerLoad } from './$types';

import { type Todo } from '$lib/onlineDB/schema';
import { todo } from '$lib/onlineDB/schema';
import { drizzle } from 'drizzle-orm/libsql';
import { client } from '$lib/onlineDB/onlineDB';
import { env } from '$env/dynamic/private';

const DB = drizzle(client(env.TURSO_CONNECTION_URL, env.TURSO_AUTH_TOKEN));
export const load = (async () => {
    const entries = await DB.select().from(todo)
    const ss = await DB.insert(todo).values({ title: 'test' });
    return {
        entries: entries
    };
}) satisfies PageServerLoad;

