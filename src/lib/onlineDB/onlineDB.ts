import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client/web';
import { env } from '$env/dynamic/private';

config({ path: '.env' }); // or .env.local

export const client = () => createClient({
    url: env.TURSO_CONNECTION_URL!,
    authToken: env.TURSO_AUTH_TOKEN!,
});

