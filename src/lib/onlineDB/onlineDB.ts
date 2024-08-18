import { env } from "$env/dynamic/private";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

const client = createClient({
    url: env.TURSO_CONNECTION_URL,
    authToken: env.TURSO_AUTH_TOKEN
});

export const DB = drizzle(client);