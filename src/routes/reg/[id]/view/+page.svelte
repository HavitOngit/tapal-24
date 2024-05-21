<script lang="ts">
	import { page } from '$app/stores';
	import UpdateEntry from '$lib/components/extraFeatures/UpdateEntry.svelte';
	import { TableBody } from '$lib/components/ui/table';
	import TableHead from '$lib/components/ui/table/table-head.svelte';
	import TableHeader from '$lib/components/ui/table/table-header.svelte';
	import TableRow from '$lib/components/ui/table/table-row.svelte';
	import Table from '$lib/components/ui/table/table.svelte';
	import { db } from '$lib/db';
	import { liveQuery } from 'dexie';

	const usage = liveQuery(() => db.usage.where({ group_id: Number($page.params.id) }).toArray());
	$: console.log($usage);
</script>

<!-- {$page.params.id}
<UpdateEntry group_id={Number($page.params.id)}></UpdateEntry> -->

{#if $usage}
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
