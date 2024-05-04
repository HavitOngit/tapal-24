import dayjs from "dayjs";
import { getDateID } from "./api";
import type { oneRate, Usage, Storage, Group } from "./custom_types";
import { db } from "./db";

let firstDate = new Date();
firstDate.setDate(1);
let workingDate = dayjs(firstDate);

let boys = 0;
let girls = 0;

let rate: oneRate[];
let stock: Storage[];

async function getInfo(RegData: Group) {
    const rates = await db.rate
        .where({ rate_unit_id: RegData.rate_unit_id, day: workingDate.format('ddd') })
        .toArray();
    const stocks = await db.storage.where({ storage_unit_id: RegData.storage_unit_id }).toArray();
    rate = rates[0].ratelist;
    stock = stocks;

    return { rate, stock };
}

// usage calculation
let forStoarageUpdate: any = [];
let before_afterlist: any = [];
let usage: any = [];
let finalData: Usage[] = [];

async function cal_usage(RegData: Group, total: number, rate: oneRate[], stock: Storage[]) {
    usage = rate.map((obj) => ({
        name: obj.name,
        amount: (obj.rate * total) / 1000,
        rate: Number(obj.rate),
        date: workingDate.toDate()
    }));
    const acc_eff = usage.forEach(
        (obj: {
            name: string;
            before_amount: number;
            after_amount: number;
            amount: number;
            group_id: any;
            date_id: any;
        }) => {
            const unit = stock.find((item) => item.name == obj.name);

            // adding
            obj.before_amount = Number(unit?.amount);
            obj.after_amount = obj.before_amount - obj.amount;
            obj.group_id = RegData.id;
            obj.date_id = getDateID(workingDate.toDate());

            forStoarageUpdate.push({
                key: unit?.id,
                changes: { amount: obj.after_amount }
            });
        }
    );
    return { usage, forStoarageUpdate };

}

// Savind to Database
async function SavingToDB(total: number, RegData: Group, workingDate: dayjs.Dayjs, usage: any, forStoarageUpdate: any, boys: number, girls: number) {
    console.log(workingDate, Date);

    db.transaction('rw', db.usage, db.storage, db.attendance, async () => {
        await db.attendance.add({
            boys: Number(boys),
            girls: Number(girls),
            total: Number(total),
            group_id: RegData.id || 100,
            date: workingDate.toDate(),
            date_id: getDateID(workingDate.toDate())
        });
        await db.usage.bulkAdd(usage);
        await db.storage.bulkUpdate(forStoarageUpdate);
    })
        .then(() => {
            // toast.success('Saved Successfully!');
            console.log('Saved Successfully!');

        })
        .catch((err) => {
            console.log('Error Saving Data!' + err);

            // toast.error('Error Saving Data!');
        });
}

async function runner(workingDate: dayjs.Dayjs, RegData: Group) {
    console.log("creating Data for " + RegData.name + "id--" + RegData.id + workingDate.format('YYYY-MM-DD'));


    const { rate, stock } = await getInfo(RegData);
    const boys = Math.floor(Math.random() * 10);
    const girls = Math.floor(Math.random() * 10);
    const total = boys + girls;
    const { usage, forStoarageUpdate } = await cal_usage(RegData, total, rate, stock);
    await SavingToDB(total, RegData, workingDate, usage, forStoarageUpdate, boys, girls);

}

export async function fake_DataGen() {
    const registers = await db.group.toArray();
    const activeRegisters = registers.filter((obj) => obj.currently_used == true);

    while (workingDate.isBefore(dayjs().endOf('month'))) {

        console.log(workingDate.format('YYYY-MM-DD'));

        const datedate = workingDate



        activeRegisters.forEach(async (RegData) => {
            console.log("creating Data for " + RegData.name + "id--" + RegData.id + workingDate.format('YYYY-MM-DD'));

            await runner(datedate, RegData);



        }


        );

        workingDate = workingDate.add(1, 'day');
    }
}