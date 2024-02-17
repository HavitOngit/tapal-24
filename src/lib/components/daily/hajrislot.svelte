<script lang="ts">
	import type { Group, Rate, oneRate, Storage } from '$lib/custom_types';
	import { db } from '$lib/db';
	import moment from 'moment';
	import Button from '../ui/button/button.svelte';
	import Attendance from './Attendance.svelte';
	import { onMount } from 'svelte';

	const current = moment();
	export let data: Group;

	let boys: number;
	let girls: number;
	$: total = Number(boys) + Number(girls);

	export let day = current.format('ddd');
	let rate: oneRate[];
	let stock: Storage[];
	async function getInfo() {
		const rates = await db.rate.where({ rate_unit_id: data.rate_unit_id, day: day }).toArray();
		const stocks = await db.storage.where({ storage_unit_id: data.storage_unit_id }).toArray();
		rate = rates[0].ratelist;
		stock = stocks;
		console.log(rate, stock, boys, girls);
	}

	// usage cal

	async function cal_usage() {
		const usage = rate.map((obj) => ({ name: obj.name, amount: obj.rate * total }));
		const before_afterlist: any = [];
		const forStoarageUpdate = [];
		const acc_eff = usage.forEach((obj) => {
			const unit = stock.find((item) => item.name == obj.name);
			before_afterlist.push({
				before_amount: unit?.amount,
				after_amount: unit?.amount - obj.amount
			});
			forStoarageUpdate.push({
				amount: unit?.amount - obj.amount,
				id: unit?.id
			});
		});
		console.log(usage, stock, forStoarageUpdate, before_afterlist);
	}
	onMount(async () => {
		await getInfo();
	});
</script>

<div>
	<div>{data.name}</div>
</div>

<Attendance bind:boys bind:girls></Attendance>
<Button on:click={cal_usage}>Status</Button>
