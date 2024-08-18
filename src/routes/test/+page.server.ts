import type { PageServerLoad } from './$types';

import { type Todo } from '$lib/onlineDB/schema';
import { todo } from '$lib/onlineDB/schema';
import { drizzle } from 'drizzle-orm/libsql';
import { client } from '$lib/onlineDB/onlineDB';

const DB = drizzle(client());
export const load = (async () => {
    const entries = await DB.select().from(todo)
    const ss = await DB.insert(todo).values({ title: 'test' });
    return {
        entries: entries
    };
}) satisfies PageServerLoad;

