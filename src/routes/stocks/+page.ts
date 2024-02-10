import type { PageLoad } from './$types';
import { db } from '$lib/db';
import { liveQuery } from 'dexie';

const storage_units = liveQuery(() => db.storage_unit.toArray());

export const load = (async () => {

    return { storage_units };
}) satisfies PageLoad;