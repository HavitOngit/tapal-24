import { db } from "./db";
import { anajlist } from "./predefined";


const cache = new Map();

export async function getImage(name: string) {
    if (cache.has(name)) {
        return cache.get(name);
    }

    const image = await anajlist.find(obj => obj.name == name);
    cache.set(name, image)
    return image
}

export function getDateID(date: Date) {
    const clean_date = new Date(date.toLocaleDateString())

    return clean_date.getTime()
}

export async function getAllUsedAnajs(rate_unit_id: number) {
    const list = await db.rate.where({ rate_unit_id: rate_unit_id }).toArray()
    const temp_store = new Map()
    if (list.length > 0) {
        await list.forEach(rate => {
            rate.ratelist.forEach(item => {
                temp_store.set(item.name, true)
            })
        })

    }

    const unique_list = temp_store.keys().toArray()

    return unique_list

}

export async function UpdateUnivarsalList(list: Storage[]) {
    const saved_data = await db.univarsalList.toArray()



}

