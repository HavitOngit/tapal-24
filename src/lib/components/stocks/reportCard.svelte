<script lang="ts">
	import { t } from 'svelte-intl-precompile';
	import type { StorageHistory } from '$lib/custom_types';
	import Badge from '../ui/badge/badge.svelte';
	import { TableBody } from '$lib/components/ui/table';
	import TableHead from '$lib/components/ui/table/table-head.svelte';
	import TableHeader from '$lib/components/ui/table/table-header.svelte';
	import TableRow from '$lib/components/ui/table/table-row.svelte';
	import Table from '$lib/components/ui/table/table.svelte';

	export let historyData: StorageHistory[] = [];
	export let incomettl: number = 0;
	export let anaj_details: anajDetails;
	export let usageregs: regDetails[];

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
</script>

<div class="flex bg-gray-200">
	<p class="ml-2 text-left text-xl font-bold">{$t(anaj_details.label)}</p>
</div>

<div class="m-2">
	<div>
		<div class="flex flex-col gap-3">
			<p class="text-lg font-semibold">
				{$t('Total Usage')}: {formatAmount(anaj_details.total)} kg
			</p>
			{#if usageregs.length > 0}
				<div class="flex flex-wrap gap-2">
					<p>{$t('used By:')}</p>
					{#each usageregs as regs}
						{#if regs.usage > 0}
							<Badge variant="outline">{regs.name}({formatAmount(regs.usage)} kg)</Badge>
						{/if}
					{/each}
				</div>
			{/if}
			<p>{$t('Total Days')}: {anaj_details.days}</p>
			{#if incomettl > 0}
				<p class="font-semibold">
					{$t('Total Income')}: {formatAmount(incomettl)} kg
				</p>
			{/if}
		</div>
	</div>
</div>
<div>
	{#if historyData.length > 0}
		<div class="m-2 flex justify-center bg-gray-100">
			<p class="text-center">{$t('Income')}</p>
		</div>
		<div id="table">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>{$t('Date')}</TableHead>

						<TableHead>{$t('Before')}</TableHead>
						<TableHead>{$t('Income')}</TableHead>
						<TableHead>{$t('After')}</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{#each historyData
						.sort((a, b) => a.date_id - b.date_id)
						.sort()
						.filter((o) => o.name === anaj_details.label) as item}
						<TableRow>
							<TableHead>{item.date.getDate()}</TableHead>

							<TableHead>{formatAmount(item.before_amount)}</TableHead>
							<TableHead>{formatAmount(item.amount)}</TableHead>
							<TableHead>{formatAmount(item.before_amount + item.amount)}</TableHead>
						</TableRow>
					{/each}
				</TableBody>
			</Table>
		</div>
	{/if}
</div>
