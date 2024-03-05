<script lang="ts">
	import type { Rates } from '$lib/custom_types';
	import CardContent from './ui/card/card-content.svelte';
	import CardHeader from './ui/card/card-header.svelte';
	import CardTitle from './ui/card/card-title.svelte';
	import Card from './ui/card/card.svelte';
	import Badge from './ui/badge/badge.svelte';
	import Label from './ui/label/label.svelte';
	import { liveQuery } from 'dexie';
	import { db } from '$lib/db';

	export let rate: Rates;

	const regis = liveQuery(() => db.group.where({ rate_unit_id: rate.id }).toArray());
</script>

<Card>
	<CardHeader><CardTitle>{rate.name}</CardTitle></CardHeader>
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
		<div class="mt-2 flex gap-2" id="used_ anaj_list">
			<Label>Anajs:</Label>
			<div class="flex flex-wrap gap-2">
				{#each rate.used_anaj || [] as anaj}
					<Badge variant="outline">{anaj}</Badge>
				{/each}
			</div>
		</div>
	</CardContent>
</Card>
