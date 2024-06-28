import { writable, derived } from "svelte/store";

export const workingDate = writable(new Date());

export const cleanDateId = derived(workingDate, $workingDate => {
    const clean_date = new Date($workingDate.toLocaleDateString())
    return clean_date.getTime()
})