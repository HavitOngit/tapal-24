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

