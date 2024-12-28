<script lang="ts">
	import { t } from 'svelte-intl-precompile';
	import { page } from '$app/stores';
	import MonthSelector from '$lib/components/reg/MonthSelector.svelte';
	import { TableBody } from '$lib/components/ui/table';
	import TableHead from '$lib/components/ui/table/table-head.svelte';
	import TableHeader from '$lib/components/ui/table/table-header.svelte';
	import TableRow from '$lib/components/ui/table/table-row.svelte';
	import Table from '$lib/components/ui/table/table.svelte';
	import type { Group, StorageHistory, Usage } from '$lib/custom_types';
	import { db } from '$lib/db';

	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import StickyHeader from '$lib/components/extraFeatures/sticky-Header.svelte';

	async function getUsage(month: number, year: number) {
		if (!insilized) return;
		try {
			$usage = await db.usage
				.where({ group_id: Number($page.params.id) })
				.filter((obj) => obj.date.getMonth() === month && obj.date.getFullYear() === year)
				.toArray();
			$usage.forEach((u) => {
				if (!$anajs.find((x) => x.label === u.name)) {
					$anajs.push({ value: $anajs.length, label: u.name });
				}
			});
			// for history

			if ($anajs.length > 0) {
				selected_anaj = Number($anajs[0].value);
			}

			anaj_details = [];
			$anajs.forEach((it) => {
				const obj = { ...it, total: 0, days: 0 };

				anaj_details.push(total(obj));
			});
			console.log(anaj_details);

			// income history
			$storagehistory = await db.storage_history
				.where({
					storage_unit_id: Number(reg?.storage_unit_id || 1)
				})
				.filter((obj) => obj.date.getMonth() === month && obj.date.getFullYear() === year)
				.toArray();
		} catch (error) {
			console.error(error);
		}
	}

	let usage = writable<Usage[]>([]);
	let anajs = writable<selector[]>([]);
	let storagehistory = writable<StorageHistory[]>([]);

	function createCSVString(data: Usage[]) {
		let csvString = '';

		// Add headers
		csvString += 'Date,Name,Usage,Before,After\n';

		// Add data rows
		data.forEach((item) => {
			csvString += `${item.date.toLocaleDateString()},${item.name},${item.amount},${item.before_amount},${item.after_amount}\n`;
		});

		return csvString;
	}

	function downloadCSV() {
		const csvString = createCSVString($usage);
		const blob = new Blob([csvString], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'usage.csv';
		a.click();
		URL.revokeObjectURL(url);
	}

	interface selector {
		value: number;
		label: string;
	}

	interface anajDetails {
		value: number;
		label: string;
		total: number;
		days: number;
	}
	// data
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

	// selectors
	let month: number = new Date().getMonth();
	let year: number = new Date().getFullYear();
	let selected_anaj: number;
	let anaj_details: anajDetails[] = [];

	function total(obj: anajDetails) {
		obj.total = 0;
		$usage.forEach((t) => {
			if (obj.label === t.name) {
				obj.total += t.amount;
				obj.days += 1;
			}
		});
		return obj;
	}

	function incomeTotal(storage_history: StorageHistory[], selected_anaj: string) {
		let total = 0;
		storage_history.forEach((t) => {
			if (selected_anaj === t.name && t.type === 'add') {
				total += t.amount;
			}
		});
		return total;
	}

	// function incomeData(selected_anaj: string, date: number) {
	// 	const data = $storagehistory.find(
	// 		(x) => x.date_id === date && x.name === selected_anaj && x.type === 'add'
	// 	);
	// 	return data;
	// }

	$: getUsage(month, year);

	let insilized = false;
	let noData = false;
	let reg: Group;
	onMount(async () => {
		insilized = true;
		// @ts-ignore
		reg = await db.group.get(Number($page.params.id));

		await getUsage(month, year);
		const allUsage = await db.usage.where({ group_id: Number($page.params.id) }).toArray();
		if (allUsage.length === 0) {
			noData = true;
		}

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

		// to ensure that current date is present
		const currentMonthExists = $monthlist.some((item) => item.value === month);
		const currentYearExists = $yearlist.some((item) => item.value === year);

		if (!currentMonthExists || !currentYearExists) {
			month = $monthlist[$monthlist.length - 1].value;
			year = $yearlist[$yearlist.length - 1].value;
		}
	});
</script>

{#if !noData}
	<div id="selector" class=" m-3 flex gap-3">
		<MonthSelector groupName="Month" bind:list={$monthlist} bind:selected={month}></MonthSelector>

		<MonthSelector groupName="Year" bind:list={$yearlist} bind:selected={year}></MonthSelector>
		{#if $anajs.length > 0}
			<MonthSelector groupName="Anaj" bind:list={$anajs} bind:selected={selected_anaj}
			></MonthSelector>
		{/if}
	</div>

	<div class="flex justify-between">
		{#if anaj_details.length > 0}
			<div class="m-3">
				<p class="text-lg font-semibold">
					{$t('Total Usage')}:
					{Number(anaj_details[selected_anaj].total.toFixed(3))} Kg
				</p>
				<p>{$t('Total Days')}: {anaj_details[selected_anaj].days}</p>
			</div>
		{/if}
		<!-- income total -->

		{#if $storagehistory.filter((x) => x.type === 'add' && x.amount > 0 && x.name === anaj_details[selected_anaj].label).length > 0}
			<div class="m-3">
				<p class="text-lg font-semibold">
					{$t('Total Income')}:
					{Number(incomeTotal($storagehistory, $anajs[selected_anaj].label).toFixed(3))} Kg
				</p>
				<a href="/stocks/{reg.storage_unit_id}/report">
					<p class=" text-right text-sm text-gray-500">{$t('View in Details')}</p>
				</a>
			</div>
		{/if}
	</div>
	{#if $usage}
		<div id="table">
			<StickyHeader></StickyHeader>
			<Table>
				<TableHeader hidden>
					<TableRow>
						<TableHead>{$t('Date')}</TableHead>
						<TableHead>{$t('Rate')}</TableHead>
						<TableHead>{$t('Before')}</TableHead>
						<TableHead>{$t('Usage')}</TableHead>
						<TableHead>{$t('After')}</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{#each $usage.sort((a, b) => a.date_id - b.date_id).sort() as item}
						{#if $anajs[selected_anaj].label === item.name}
							<TableRow>
								<TableHead>{item.date.getDate()}</TableHead>
								<TableHead>{item.rate}</TableHead>
								<TableHead>{Number(item.before_amount.toFixed(3))}</TableHead>
								<TableHead>{Number(item.amount.toFixed(3))}</TableHead>
								<TableHead>{Number(item.after_amount.toFixed(3))}</TableHead>
							</TableRow>
						{/if}
					{/each}
				</TableBody>
			</Table>
		</div>
	{/if}
{:else}
	<div class="m-10 flex justify-center">
		<p>{$t('no Data Found')}</p>
	</div>
{/if}
