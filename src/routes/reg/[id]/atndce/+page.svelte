<script lang="ts">
	import { page } from '$app/stores';
	import MonthSelector from '$lib/components/reg/MonthSelector.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { TableBody } from '$lib/components/ui/table';
	import TableHead from '$lib/components/ui/table/table-head.svelte';
	import TableHeader from '$lib/components/ui/table/table-header.svelte';
	import TableRow from '$lib/components/ui/table/table-row.svelte';
	import Table from '$lib/components/ui/table/table.svelte';
	import type { Attendance, Group } from '$lib/custom_types';
	import { db } from '$lib/db';

	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	const id = Number($page.params.id);

	async function getUsage(month: number, year: number) {
		if (!insilized) return;
		try {
			$atndce = await db.attendance
				.where({ group_id: Number($page.params.id) })
				.filter((obj) => obj.date.getMonth() === month && obj.date.getFullYear() === year)
				.toArray();
		} catch (error) {
			console.error(error);
		}
	}

	let atndce = writable<Attendance[]>([]);

	// function createCSVString(data: Attendance[]) {
	// 	let csvString = '';

	// 	// Add headers
	// 	csvString += 'Date,Name,Usage,Before,After\n';

	// 	// Add data rows
	// 	data.forEach((item) => {
	// 		csvString += `${item.date.toLocaleDateString()},${item.name},${item.amount},${item.before_amount},${item.after_amount}\n`;
	// 	});

	// 	return csvString;
	// }

	// function downloadCSV() {
	// 	const csvString = createCSVString($atndce);
	// 	const blob = new Blob([csvString], { type: 'text/csv' });
	// 	const url = URL.createObjectURL(blob);
	// 	const a = document.createElement('a');
	// 	a.href = url;
	// 	a.download = 'usage.csv';
	// 	a.click();
	// 	URL.revokeObjectURL(url);
	// }

	interface selector {
		value: number;
		label: string;
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
	let regs: Group | undefined;

	// function total(obj: anajDetails) {
	// 	obj.total = 0;
	// 	$usage.forEach((t) => {
	// 		if (obj.label === t.name) {
	// 			obj.total += t.amount;
	// 		}
	// 	});
	// 	return obj;
	// }

	$: getUsage(month, year);

	let insilized = false;
	onMount(async () => {
		insilized = true;
		regs = await db.group.get(id);
		await getUsage(month, year);
		const allUsage = await db.attendance.where({ group_id: Number($page.params.id) }).toArray();
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

<!-- {$page.params.id}
<UpdateEntry group_id={Number($page.params.id)}></UpdateEntry> -->

<div id="selector" class=" m-3 flex gap-3">
	<MonthSelector groupName="Month" bind:list={$monthlist} bind:selected={month}></MonthSelector>

	<MonthSelector groupName="Year" bind:list={$yearlist} bind:selected={year}></MonthSelector>
</div>
<!-- <div class="m-3">
	<p class="text-lg font-semibold">
		Total:
	</p>
</div> -->
{#if $atndce}
	{#if regs}
		<div class="m-3 flex gap-1">
			<p class="font-semibold">Registred:</p>
			<Badge class="flex gap-2" variant="outline">
				Boys
				<span class="font-semibold">{regs.boys}</span>
			</Badge> +
			<Badge class="flex gap-2" variant="outline">
				Girls
				<span class="font-semibold">{regs.girls}</span>
			</Badge>
			=
			<Badge class="flex gap-2">
				total
				<span class="font-semibold">{(regs.boys || 0) + (regs.girls || 0)}</span>
			</Badge>
		</div>
	{/if}
	<div class="m-3">
		<p class="text-lg font-semibold">
			Total Days: {$atndce.length}
		</p>
	</div>
	<!-- <div>
		<Button on:click={downloadCSV}>Export CVS</Button>
	</div> -->
	<div id="table">
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Date</TableHead>

					<TableHead>Boys</TableHead>
					<TableHead>Girls</TableHead>
					<TableHead>Total</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{#each $atndce.sort((a, b) => a.date_id - b.date_id).sort() as item}
					<TableRow>
						<TableHead>{item.date.getDate()}</TableHead>
						<TableHead>{item.boys}</TableHead>
						<TableHead>{item.girls}</TableHead>
						<TableHead>{item.total}</TableHead>
					</TableRow>
				{/each}
			</TableBody>
		</Table>
	</div>
{/if}
