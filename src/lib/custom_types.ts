
export interface Group {
    id?: number,
    name: string,
    storage_unit_id: number,
    rate_unit_id: number,
    currently_used: true | false
}

export interface Attendance {
    id?: number,
    date: Date,
    date_id: number,
    boys: number,
    girls: number,
    total: number,
    group_id: number,
}

export interface StorageUnit {
    id?: number,
    name: string,

}
export interface Storage {
    id?: number,
    name: string,
    amount: number,
    storage_unit_id: number

}


export interface StorageHistory {
    id?: number,
    date: Date,
    date_id: number,
    name: string,
    amount: number,
    storage_unit_id: number
}

export interface Usage {
    id?: number,
    date: Date,
    date_id: number,
    name: string,
    amount: number,
    before_amount: number,
    after_amount: number,
    rate: number,
    group_id: number,
    storage_unit_id: number
}

export interface oneRate {
    name: string,
    rate: number
}
export interface Rate {
    id?: number,
    day: string,

    ratelist: oneRate[],
    rate_unit_id: number
}

export interface Rates {
    id?: number,
    name: string,

    used_anaj?: []
}

export interface BackUp {
    id?: number,
    date: Date,
    date_id: number,
    start: Date,
    end: Date,
    action: "Upload" | "Download"
}

export interface Anajlist_init {
    name: string,
    image: string
}

export interface Storage_Anajs {
    name: string,
    amount: number,
}

export interface RegForm {
    name: string,
    storage_unit_id: number,
    rate_unit_id: number,
    currently_used: true | false
}

export interface Selector {
    id: number,
    name: string
}