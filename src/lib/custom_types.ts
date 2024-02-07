
export interface Group {
    id?: number,
    name: string
}

export interface Attendance {
    id?: number,
    date: Date,
    boys: number,
    girls: number,
    total: number,
    group_id: number
}

export interface Storage {
    id?: number,
    name: string,
    amount: number,
    group_id: number
}

export interface StorageHistory {
    id?: number,
    date: Date,
    name: string,
    amount: number,
    group_id: number
}

export interface Usage {
    id?: number,
    date: Date,
    name: string,
    amount: number,
    before_amount: number,
    after_amount: number,
    rate: number,
    group_id: number
}

export interface Rates {
    id?: number,
    day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun",
    name: string,
    rate: number,
    group_id: number
}

export interface BackUp {
    id?: number,
    date: Date,
    start: Date,
    end: Date,
    action: "Upload" | "Download"
}

