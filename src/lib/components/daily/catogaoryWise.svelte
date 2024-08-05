<!-- <script lang="ts">
	import type { catogaoryWise, Attendance } from '$lib/custom_types';
	import TableBody from '../ui/table/table-body.svelte';
	import TableHead from '../ui/table/table-head.svelte';
	import TableHeader from '../ui/table/table-header.svelte';
	import TableRow from '../ui/table/table-row.svelte';
	import Table from '../ui/table/table.svelte';
	import { t } from 'svelte-intl-precompile';
	

	export let metadata: catogaoryWise[];
	export let attendance: Attendance[];
	export let selected: string;
</script>

<Table>
	<TableHeader>
		{#if metadata}
        <TableRow>

            <TableHead></TableHead>
            
			{#each metadata as item}
            <TableHead>{$t(item.name)}</TableHead>
			{/each}
        </TableRow>
		{/if}
	</TableHeader>
    <TableBody>
        
    </TableBody>
</Table> -->
