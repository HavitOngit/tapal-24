<script lang="ts">
	import type { Group, Rate, oneRate, Storage, Usage } from '$lib/custom_types';
	import { db } from '$lib/db';
	import dayjs from 'dayjs';
	import 'dayjs/locale/gu';
	import Button from '../ui/button/button.svelte';
	import Attendance from './Attendance.svelte';
	import { onMount } from 'svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import Rateform from '../Rateform.svelte';
	import UsageTable from './UsageTable.svelte';
	import { Item } from '../ui/select';
	import { updated } from '$app/stores';
	import Layout from '../../../routes/+layout.svelte';
	import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
	import { getDateID } from '$lib/api';

	dayjs.extend(isSameOrBefore);
	dayjs.locale('en');
	let current = dayjs();

	export let LastDate: Date;

	let workingDate = dayjs(LastDate);
	export let data: Group;

	let boys: number;
	let girls: number;
	$: total = Number(boys) + Number(girls);

	let rate: oneRate[];
	let stock: Storage[];
	async function getInfo() {
		const rates = await db.rate
			.where({ rate_unit_id: data.rate_unit_id, day: workingDate.format('ddd') })
			.toArray();
		const stocks = await db.storage.where({ storage_unit_id: data.storage_unit_id }).toArray();
		rate = rates[0].ratelist;
		stock = stocks;
		console.log(rate, stock, boys, girls);
	}

	// usage cal

	let forStoarageUpdate: any = [];
	let before_afterlist: any = [];
	let usage: any = [];
	let finalData: Usage[] = [];

	async function cal_usage() {
		usage = rate.map((obj) => ({
			name: obj.name,
			amount: obj.rate * total,
			rate: Number(obj.rate),
			date: workingDate.toDate()
		}));
		const acc_eff = usage.forEach((obj) => {
			const unit = stock.find((item) => item.name == obj.name);

			// adding
			obj.before_amount = Number(unit?.amount);
			obj.after_amount = unit?.amount - obj.amount;
			obj.group_id = data.id;
			obj.date_id = getDateID(workingDate.toDate());

			// before_afterlist.push({
			// 	before_amount: unit?.amount,
			// 	after_amount: unit?.amount - obj.amount,
			// 	name: unit?.name
			// });
			forStoarageUpdate.push({
				amount: unit?.amount - obj.amount,
				id: unit?.id
			});
		});

		console.log(rate);

		showRate = false;
	}

	let upToDate = false;

	async function SaveToDB() {
		console.log(usage);
		if (workingDate.isSameOrBefore(current) && !upToDate) {
			const status = await db.usage.bulkAdd(usage);
			if (status && workingDate.isSame(current, 'day')) {
				upToDate = true;
			}
			if (status && workingDate.add(1, 'day').isBefore(current)) {
				workingDate = workingDate.add(1, 'day');
				await getInfo(); // get and sets new rates
			}
		}
	}

	$: console.log(upToDate);

	onMount(async () => {
		await getInfo();
	});

	//behavior
	let showRate: boolean = false;
</script>

{#if upToDate}
	<p class="text-yellow-400">UpToDate</p>
{/if}
<div class="flex justify-between">
	<div>
		<div>{data.name}</div>
	</div>
	<div class="flex flex-col">
		{workingDate.format('DD/MM/YYYY')}

		<!-- for update functionality -->
		<div class="flex">
			<Button
				variant="outline"
				on:click={() => {
					workingDate = workingDate.subtract(1, 'day');
				}}>-</Button
			>
			<Button
				variant="outline"
				on:click={() => {
					workingDate = workingDate.add(1, 'day');
				}}>+</Button
			>
		</div>
	</div>
</div>

<Attendance bind:boys bind:girls></Attendance>

<AlertDialog.Root>
	<AlertDialog.Trigger on:click={cal_usage}>Submit</AlertDialog.Trigger>
	<AlertDialog.Content>
		<AlertDialog.Header class="flex ">
			<!-- <AlertDialog.Title>{Ratedetails.day}</AlertDialog.Title> -->
			<AlertDialog.Description
				><Button
					on:click={() => {
						showRate = !showRate;
					}}
					variant="link">Change Rate</Button
				></AlertDialog.Description
			>
		</AlertDialog.Header>

		{#if showRate}
			<Rateform forInit={false} anajlist={rate} bind:ratelist={rate}></Rateform>
			<Button on:click={cal_usage}>Apply</Button>
		{/if}
		<UsageTable bind:usageData={usage}></UsageTable>
		<AlertDialog.Footer class="flex flex-row justify-around">
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action on:click={SaveToDB}>Confirm</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

<Button
	on:click={() => {
		console.log(LastDate);
	}}>Status</Button
>
