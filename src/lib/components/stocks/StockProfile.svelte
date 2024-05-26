<script lang="ts">
	import type { Rates, StorageUnit } from '$lib/custom_types';
	import CardContent from '../ui/card/card-content.svelte';
	import CardHeader from '../ui/card/card-header.svelte';
	import CardTitle from '../ui/card/card-title.svelte';
	import Card from '../ui/card/card.svelte';
	import Badge from '../ui/badge/badge.svelte';
	import Label from '../ui/label/label.svelte';
	import { liveQuery } from 'dexie';
	import { db } from '$lib/db';

	export let stock: StorageUnit;

	const regis = liveQuery(() => db.group.where({ storage_unit_id: stock.id }).toArray());
</script>

<Card>
	<CardHeader><CardTitle>{stock.name}</CardTitle></CardHeader>
	<CardContent class="flex flex-col gap-2">
		{#if $regis && $regis.length > 0}
			<div class="mt-2 flex gap-2" id="used_ anaj_list">
				<Label>usedBy:</Label>
				<div class="flex flex-wrap gap-2">
					{#each $regis || [] as reg}
						<Badge variant="outline">{reg.name}</Badge>
					{/each}
				</div>
			</div>
		{/if}
	</CardContent>
</Card>
