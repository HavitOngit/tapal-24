import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const todo = sqliteTable("todo", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    title: text("title"),
    done: integer("done", { mode: "boolean" }).notNull().default(false)
})

export type Todo = typeof todo.$inferInsert
export type TodoRead = typeof todo.$inferSelect




export const user = sqliteTable("user", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    email: text("email").notNull(),
    image: text("image")
});

export type User = typeof user.$inferInsert;
export type UserRead = typeof user.$inferSelect;

export const univarsalList = sqliteTable("univarsalList", {
    g_id: integer("id").primaryKey({ autoIncrement: true }),
    id: integer("id").notNull(),
    name: text("name").notNull(),
    image: text("image").notNull(),
    timestamp: integer("time", { mode: "timestamp_ms" })
})

