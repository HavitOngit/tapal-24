<script lang="ts">
	import { page } from '$app/stores';
	import UpdateEntry from '$lib/components/extraFeatures/UpdateEntry.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { TableBody } from '$lib/components/ui/table';
	import TableHead from '$lib/components/ui/table/table-head.svelte';
	import TableHeader from '$lib/components/ui/table/table-header.svelte';
	import TableRow from '$lib/components/ui/table/table-row.svelte';
	import Table from '$lib/components/ui/table/table.svelte';
	import type { Usage } from '$lib/custom_types';
	import { db } from '$lib/db';
	import { liveQuery } from 'dexie';

	const usage = liveQuery(() => db.usage.where({ group_id: Number($page.params.id) }).toArray());
	$: console.log($usage);

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
		a.download = '$usage.csv';
		a.click();
		URL.revokeObjectURL(url);
	}
</script>

<!-- {$page.params.id}
<UpdateEntry group_id={Number($page.params.id)}></UpdateEntry> -->

{#if $usage}
	<div>
		<Button on:click={downloadCSV}>Export CVS</Button>
	</div>
	<Table>
		<TableHeader>
			<TableRow>
				<TableHead>Date</TableHead>
				<TableHead>Name</TableHead>
				<TableHead>Usage</TableHead>
				<TableHead>Before</TableHead>
				<TableHead>After</TableHead>
			</TableRow>
		</TableHeader>
		<TableBody>
			{#each $usage as item}
				<TableRow>
					<TableHead>{item.date.toLocaleDateString()}</TableHead>
					<TableHead>{item.name}</TableHead>
					<TableHead>{item.amount}</TableHead>
					<TableHead>{item.before_amount}</TableHead>
					<TableHead>{item.after_amount}</TableHead>
				</TableRow>
			{/each}
		</TableBody>
	</Table>
{/if}
