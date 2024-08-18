
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client/web';
import { TURSO_CONNECTION_URL, TURSO_AUTH_TOKEN } from '$env/static/private';



export const client = () => createClient({
    url: TURSO_CONNECTION_URL || '',
    authToken: TURSO_AUTH_TOKEN || '',
});

