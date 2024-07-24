<script lang="ts">
	import { page } from '$app/stores';
	import MonthSelector from '$lib/components/reg/MonthSelector.svelte';
	import { TableBody } from '$lib/components/ui/table';
	import TableHead from '$lib/components/ui/table/table-head.svelte';
	import TableHeader from '$lib/components/ui/table/table-header.svelte';
	import TableRow from '$lib/components/ui/table/table-row.svelte';
	import Table from '$lib/components/ui/table/table.svelte';
	import type { Group, Usage } from '$lib/custom_types';
	import { db } from '$lib/db';

	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	const id = Number($page.params.id);

	async function getUsage(month: number, year: number) {
		if (!insilized) return;
		try {
			$usage = await db.usage
				.where({ storage_unit_id: id })
				.filter((obj) => obj.date.getMonth() === month && obj.date.getFullYear() === year)
				.toArray();

			$usage.forEach((u) => {
				if (!$anajs.find((x) => x.label === u.name)) {
					$anajs.push({ value: $anajs.length, label: u.name });
				}
			});
			console.log(Array.from($anajs));

			selected_anaj = Number($anajs[0].value);

			anaj_details = [];
			reg_details = [];
			$anajs.forEach((it) => {
				const obj = { ...it, total: 0, days: 0 };

				anaj_details.push(total(obj));
				regs.forEach((r) => {
					const reg: regDetails = { name: r.name, id: r.id, days: 0, usage: 0 };
					reg_details.push(reg_d_total(obj, reg));
				});
			});
			console.log(anaj_details);
		} catch (error) {
			console.error(error);
		}
	}

	let usage = writable<Usage[]>([]);
	let anajs = writable<selector[]>([]);
	let regs: Group[];

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

	interface regDetails {
		id: number | undefined;
		name: string;
		usage: number;
		days: number;
		anajName?: string;
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
	let anaj_details: anajDetails[];
	let reg_details: regDetails[] = [];

	function total(obj: anajDetails) {
		obj.total = 0;
		const days = new Set<number>([]);
		$usage.forEach((t) => {
			if (obj.label === t.name) {
				obj.total += t.amount;

				days.add(t.date.getDay());
			}
		});
		obj.days = days.size;
		return obj;
	}
	function reg_d_total(obj: anajDetails, reg: regDetails) {
		obj.total = 0;
		reg.usage = 0;
		reg.days = 0;
		reg.anajName = obj.label;
		$usage.forEach((t) => {
			if (obj.label === t.name) {
				obj.total += t.amount;
				if (t.group_id === reg.id) {
					reg.usage += t.amount;
					reg.days += 1;
				}
			}
		});
		reg.usage = Number(reg.usage.toFixed(3));
		return reg;
	}

	$: getUsage(month, year);

	let insilized = false;
	onMount(async () => {
		insilized = true;
		regs = await db.group.where({ storage_unit_id: id }).toArray();
		await getUsage(month, year);
		const allUsage = await db.usage.where({ group_id: Number($page.params.id) }).toArray();
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
	{#if $anajs.length > 0}
		<MonthSelector groupName="Anaj" bind:list={$anajs} bind:selected={selected_anaj}
		></MonthSelector>
	{/if}
</div>
<div class="m-3">
	{#if anaj_details}
		<p class="text-lg font-semibold">
			Total:
			{Number(anaj_details[selected_anaj].total.toFixed(3))} Kg
		</p>
		<p>Days:{anaj_details[selected_anaj].days}</p>
	{/if}
</div>

<div class="m-3 gap-2">
	{#each reg_details as reg}
		<div class="flex gap-2">
			{#if reg.anajName === anaj_details[selected_anaj].label}
				<p>{reg.name}: {reg.usage} kg</p>
				<p>avg: {Number((reg.usage / reg.days).toFixed(3))} kg</p>
			{/if}
		</div>
	{/each}
</div>
{#if $usage}
	<!-- <div>
		<Button on:click={downloadCSV}>Export CVS</Button>
	</div> -->
	<div id="table">
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Date</TableHead>
					<TableHead>Rate</TableHead>
					<TableHead>Before</TableHead>
					<TableHead>Usage</TableHead>
					<TableHead>After</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{#each $usage
					.sort((a, b) => a.date_id - b.date_id)
					.sort()
					.filter((o) => o.name === $anajs[selected_anaj].label) as item}
					<TableRow>
						<TableHead>{item.date.getDate()}</TableHead>
						<TableHead>{item.rate}</TableHead>
						<TableHead>{Number(item.before_amount.toFixed(3))}</TableHead>
						<TableHead>{Number(item.amount.toFixed(3))}</TableHead>
						<TableHead>{Number(item.after_amount.toFixed(3))}</TableHead>
					</TableRow>
				{/each}
			</TableBody>
		</Table>
	</div>
{/if}
