import Dexie, { type Table } from "dexie";
import * as custom_types from "$lib/custom_types";

export class AnajDB extends Dexie {
    group!: Table<custom_types.Group>;
    attendance!: Table<custom_types.Attendance>;
    storage!: Table<custom_types.Storage>;
    storage_history!: Table<custom_types.StorageHistory>;
    usage!: Table<custom_types.Usage>;
    rates!: Table<custom_types.Rates>;
    backup!: Table<custom_types.BackUp>;

    constructor() {
        super('AnajDB');

        this.version(1).stores({
            group: '++id, name',
            attendance: '++id, date, boys, girls, total, group_id',
            storage: '++id, name, amount, group_id',
            storage_history: '++id, date, name, amount, group_id',
            usage: '++id, date, name, amount, before_amount, after_amount, rate, group_id',
            rates: '++id, day, name, rate, group_id',
            backup: '++id, date, start, end, action'
        })
    }
}


export const db = new AnajDB();