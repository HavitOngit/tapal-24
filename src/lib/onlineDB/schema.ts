import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const todo = sqliteTable("todo", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    title: text("title"),
    done: integer("done", { mode: "boolean" }).notNull().default(false)
})

export type Todo = typeof todo.$inferInsert
export type TodoRead = typeof todo.$inferSelect