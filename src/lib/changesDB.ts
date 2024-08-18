import { db } from "$lib/db";
import Dexie, { type Table } from "dexie";
import type { Change } from "./custom_types";

console.log('changesDB online');

db.tables.forEach(table => {
    table.hook("creating", function (primKey, obj, trans) {
        this.onsuccess = function (pk) {
            console.log("Record created with primary key:", { pk, obj, trans });
            changesDB.changes.add({
                type: "creating",
                table: table.name,
                timestamp: new Date(),
                db_ID: pk
            })
        };
        console.log('Creating record', { primKey, obj, trans });
    });

    table.hook("deleting", function (pk, obj, trans) {
        console.log('Deleting record', { pk, obj, trans });
        changesDB.changes.add({
            type: "deleting",
            table: table.name,
            timestamp: new Date(),
            db_ID: pk
        })
    });

    table.hook("updating", function (mod, pk, obj, trans) {
        console.log('Updating record', { pk, obj, mod, trans });
        changesDB.changes.add({
            type: "updating",
            table: table.name,
            timestamp: new Date(),
            db_ID: pk

        });
    });
})


export class ChangesDB extends Dexie {
    changes!: Table<Change>;


    constructor() {
        super('ChangesDB');

        this.version(1).stores({
            changes: '++id, type, table, timestamp, db_ID'

        })
    }
}


export const changesDB = new ChangesDB();
