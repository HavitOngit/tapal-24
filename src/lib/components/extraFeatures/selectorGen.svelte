<script lang="ts">
	import { page } from '$app/stores';
	import { db } from '$lib/db';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import MonthSelector from '../reg/MonthSelector.svelte';

	export let propertyName: string = 'storage_unit_id';
	export let id: number = 0;
	export let month: number;
	export let year: number;
	interface selector {
		value: number;
		label: string;
	}
	const months: Map<number, selector> = new Map();

	const years: Map<number, selector> = new Map();

	let monthlist = writable<selector[]>([
		{ value: 0, label: 'January' },
		{ value: 1, label: 'February' },
		{ value: 2, label: 'March' },
		{ value: 3, label: 'April' },
		{ value: 4, label: 'May' },
		{ value: 5, label: 'June' },
		{ value: 6, label: 'July' },
		{ value: 7, label: 'August' },
		{ value: 8, label: 'September' },
		{ value: 9, label: 'October' },
		{ value: 10, label: 'November' },
		{ value: 11, label: 'December' }
	]);
	let yearlist = writable<selector[]>([
		{ value: 2021, label: '2021' },
		{ value: 2022, label: '2022' },
		{ value: 2023, label: '2023' },
		{ value: 2024, label: '2024' }
	]);

	onMount(async () => {
		const allUsage = await db.usage.where(propertyName).equals(id).toArray();
		allUsage.forEach((u) => {
			if (!months.has(u.date.getMonth())) {
				months.set(u.date.getMonth(), {
					value: u.date.getMonth(),
					label: u.date.toLocaleString('default', { month: 'long' })
				});
			}
			if (!years.has(u.date.getFullYear())) {
				years.set(u.date.getFullYear(), {
					value: u.date.getFullYear(),
					label: u.date.getFullYear().toString()
				});
			}
		});
		$monthlist = Array.from(months.values());
		$yearlist = Array.from(years.values());
	});
</script>

<MonthSelector groupName="Month" bind:list={$monthlist} bind:selected={month}></MonthSelector>

<MonthSelector groupName="Year" bind:list={$yearlist} bind:selected={year}></MonthSelector>
