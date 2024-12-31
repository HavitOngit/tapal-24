import Dexie, { type Table } from "dexie";
import * as custom_types from "$lib/custom_types";
import { anajlist } from "./predefined";


export interface univarsalList {
    id?: number,
    name: string,
    image?: string
}
export class AnajDB extends Dexie {
    group!: Table<custom_types.Group>;
    attendance!: Table<custom_types.Attendance>;
    storage_unit!: Table<custom_types.StorageUnit>;
    storage!: Table<custom_types.Storage>;
    storage_history!: Table<custom_types.StorageHistory>;
    usage!: Table<custom_types.Usage>;
    rates!: Table<custom_types.Rates>;
    rate!: Table<custom_types.Rate>;
    backup!: Table<custom_types.BackUp>;
    univarsalList!: Table<univarsalList>;
    money_rates!: Table<custom_types.MoneyRates>;

    constructor() {
        super('AnajDB');

        this.version(1).stores({
            group: '++id, name, storage_unit_id, rate_unit_id, currently_used',
            attendance: '++id, date, date_id, boys, girls, total, group_id',
            storage_unit: '++id, name',
            storage: '++id, name, amount, storage_unit_id',
            storage_history: '++id, date, date_id, name, amount, storage_unit_id',
            usage: '++id, date, date_id, name, amount, before_amount, after_amount, rate, group_id, storage_unit_id',
            rates: '++id, name',
            rate: '++id, day, ratelist, rate_unit_id',
            backup: '++id, date, date_id, start, end, action',
            univarsalList: '++id, name',
            money_rates: '++id, name, rates, total'
        })
    }
}


export const db = new AnajDB();

db.transaction('rw', db.univarsalList, async () => {
    const list = await db.univarsalList.toArray()
    if (list.length === 0) {
        db.univarsalList.bulkPut(anajlist)

    }
})

