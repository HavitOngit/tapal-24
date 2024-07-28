<script lang="ts">
	import { page } from '$app/stores';
	import MonthSelector from '$lib/components/reg/MonthSelector.svelte';
	import ReportCard from '$lib/components/stocks/reportCard.svelte';
	import type { Group, Storage, StorageHistory, Usage } from '$lib/custom_types';
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

			$stoargeHistory = await db.storage_history
				.where({ storage_unit_id: id })
				.filter((obj) => obj.date.getMonth() === month && obj.date.getFullYear() === year)
				.toArray();

			if (!$anajs.find((x) => x.label === 'ALL')) {
				$anajs.push({ value: $anajs.length, label: 'ALL' });
			}
			$stocks.forEach((u) => {
				if (!$anajs.find((x) => x.label === u.name)) {
					$anajs.push({ value: $anajs.length, label: u.name });
				}
			});
			console.log(Array.from($anajs));

			selected_anaj = Number($anajs[0].value);

			anaj_details = [];
			reg_details = [];
			income_details = [];
			$anajs.forEach((it) => {
				const obj = { ...it, total: 0, days: 0 };
				const obj2 = { ...it, total: 0, days: 0 };

				anaj_details.push(total(obj));
				income_details.push(income_total(obj2));
				regs.forEach((r) => {
					const reg: regDetails = { name: r.name, id: r.id, days: 0, usage: 0 };
					reg_details.push(reg_d_total(obj, reg));
				});
			});

			console.log(income_details);
		} catch (error) {
			console.error(error);
		}
	}

	let usage = writable<Usage[]>([]);
	let anajs = writable<selector[]>([]);
	let stocks = writable<Storage[]>([]);
	let regs: Group[];
	let stoargeHistory = writable<StorageHistory[]>([]);

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

	interface incomeDetails {
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
	let anaj_details: anajDetails[] = [];
	let reg_details: regDetails[] = [];
	let income_details: incomeDetails[] = [];

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
	function income_total(obj: incomeDetails) {
		obj.total = 0;
		const days = new Set<number>([]);
		$stoargeHistory.forEach((t) => {
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
		$stocks = await db.storage.where({ storage_unit_id: id }).toArray();
		await getUsage(month, year);
		const allUsage = await db.usage.where({ group_id: Number($page.params.id) }).toArray();
		$stoargeHistory = await db.storage_history.where({ storage_unit_id: id }).toArray();
		$stoargeHistory.forEach((u) => {
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

	function formatAmount(amount: any) {
		// Check if amount is already a number
		if (typeof amount === 'number') {
			return Number(amount.toFixed(3));
		}
		// Attempt to convert to a number if it's a string
		const parsed = parseFloat(amount);
		if (!isNaN(parsed)) {
			return Number(parsed.toFixed(3));
		}
		// Handle non-numeric values
		return '0'; // Or any other fallback logic
	}

	let currentAnaj: anajDetails | undefined = anaj_details.find((x) => x.value === selected_anaj);
	$: if (selected_anaj) {
		currentAnaj = anaj_details.find((x) => x.value === selected_anaj);
	}
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
{#if selected_anaj > 0}
	<div
		class="m-3 flex flex-col gap-2 rounded-sm
border"
	>
		{#if currentAnaj}
			<ReportCard
				anaj_details={currentAnaj}
				historyData={$stoargeHistory.filter((x) => x.name === currentAnaj.label)}
				incomettl={income_details.find((i) => i.label === currentAnaj.label)?.total}
				usageregs={reg_details.filter((x) => x.anajName === currentAnaj.label && x.usage > 0)}
			></ReportCard>
		{/if}
	</div>
{:else}
	{#each anaj_details as anajD}
		{#if (anajD.value > 0 && anajD.total > 0) || income_details.find((i) => i.label === anajD.label)?.total || 0 > 0}
			<div
				class="m-3 flex flex-col gap-2 rounded-sm
			 border"
			>
				<ReportCard
					anaj_details={anajD}
					historyData={$stoargeHistory.filter((x) => x.name === anajD.label)}
					incomettl={income_details.find((i) => i.label === anajD.label)?.total}
					usageregs={reg_details.filter((x) => x.anajName === anajD.label && x.usage > 0)}
				></ReportCard>
			</div>
		{/if}
	{/each}
{/if}
