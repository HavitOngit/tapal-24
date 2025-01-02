<script lang="ts">
	import CalcShow from '$lib/components/money/calc-show.svelte';
	import Money from '$lib/components/prints/money.svelte';
	import MonthSelector from '$lib/components/reg/MonthSelector.svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import Button from '$lib/components/ui/button/button.svelte';
	import CardHeader from '$lib/components/ui/card/card-header.svelte';
	import CardTitle from '$lib/components/ui/card/card-title.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import type { MoneyRates, oneRate } from '$lib/custom_types';
	import { db } from '$lib/db';
	import { CalculatorIcon, IndianRupeeIcon, SettingsIcon, X } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { t } from 'svelte-intl-precompile';
	let CancelBtn: HTMLButtonElement;
	let TriggerBtn: HTMLButtonElement;

	interface Onevouture {
		name: string;
		value: number;
		holding?: number;
	}
	interface calcData {
		name: number;
		money: number;
		hajari: number;
		used: number;
		items: {
			rate_data: oneRate;
			money: number;
			used: number;
			vauture: Onevouture[];
		}[];
	}

	let attendance: number = 0;

	let loaded = false;

	let data: calcData[] = [];

	let isCalculated = false;

	function calc(value: number) {
		const hajari = Number(attendance * value);
		const money = moneyRate.total * hajari;
		const items = moneyRate.rates.map((x) => {
			const m = Number(x.rate * hajari);
			const vauture: Onevouture[] = [];
			return {
				rate_data: x,
				money: m,
				used: 0,
				vauture: vauture
			};
		});
		return {
			name: value * 100,
			money,
			hajari,
			used: 0,
			items
		};
	}

	function init() {
		// @ts-ignore
		moneyRate = rates!.find((r) => r.id === selectedRate);
		attendance = Number(attendance);
		if (!moneyRate) {
			return;
		}
		loaded = true;
		total_Money = Number(attendance * moneyRate.total);
		data = [calc(0.4), calc(0.6)];
		isCalculated = true;
	}
	let moneyRate: MoneyRates;
	let rates: MoneyRates[];
	let selectedRate: number = 0;
	let selectionlist: { value: number; label: string }[] = [];
	let total_Money = 0;

	onMount(async () => {
		rates = await db.money_rates.toArray();
		// @ts-ignore
		selectionlist = rates.map((r) => ({ value: r.id, label: r.name }));
		selectedRate = selectionlist[0].value;
		TriggerBtn.click();
	});
</script>

<div id="alerts" class="hidden">
	<AlertDialog.Root>
		<AlertDialog.Trigger bind:el={TriggerBtn}></AlertDialog.Trigger>
		<AlertDialog.Content>
			<AlertDialog.Header>
				<AlertDialog.Title class="flex justify-between"></AlertDialog.Title>
				<form
					on:submit={(e) => {
						e.preventDefault();
						init();
					}}
				>
					<AlertDialog.Description class="flex flex-col items-start justify-start gap-6 p-2">
						<Label class="text-xl font-medium">{$t('Rate')}</Label>
						<MonthSelector groupName="Rates" bind:selected={selectedRate} list={selectionlist} />
						<Label class="text-xl font-medium">{$t('Attendance')}</Label>
						<Input bind:value={attendance} class="mb-4" type="number" autofocus />
					</AlertDialog.Description>
				</form>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Action type="submit" on:click={init}>{$t('Submit')}</AlertDialog.Action>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>
</div>

{#if loaded}
	<div class="m-2 grid grid-cols-2 gap-3">
		<Card class="relative flex justify-between">
			<div class="flex justify-between gap-4 p-2">
				<div class="m-2 text-lg text-gray-700">
					<p>{$t('Rate')}: {moneyRate.name}</p>
					<p>{$t('Money Rate')}: {moneyRate.total}</p>
					<p>{$t('Attendance')}: {attendance}</p>
				</div>
			</div>
			<button
				class="absolute right-0 top-0 p-1"
				on:click={() => {
					TriggerBtn.click();
				}}><SettingsIcon></SettingsIcon></button
			>
		</Card>
		<Card class="flex flex-col justify-end p-3">
			<p class="text-right text-gray-400">Total</p>
			<div class="flex items-baseline justify-end gap-1">
				<IndianRupeeIcon class="items-baseline"></IndianRupeeIcon>
				<p class="text-4xl font-semibold text-gray-700">{total_Money}</p>
			</div>
		</Card>
	</div>
{/if}

{#if isCalculated}
	<div class="flex flex-col gap-4">
		{#each data as i}
			<CalcShow data={i}></CalcShow>
		{/each}
	</div>
	<!-- <Money data1={data[0]} data2={data[1]} date={new Date().toLocaleDateString()}></Money> -->
{/if}
