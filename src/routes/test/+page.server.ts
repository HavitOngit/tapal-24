import type { PageServerLoad } from './$types';
import { DB } from '$lib/onlineDB/onlineDB';
import { type Todo } from '$lib/onlineDB/schema';
import { todo } from '$lib/onlineDB/schema';


export const load = (async () => {
    const entries = await DB.select().from(todo)
    const ss = await DB.insert(todo).values({ title: 'test' });
    return {
        entries: entries
    };
}) satisfies PageServerLoad;

