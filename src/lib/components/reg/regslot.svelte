<script lang="ts">
	import type { Group } from '$lib/custom_types';
	import { liveQuery } from 'dexie';
	import CardContent from '../ui/card/card-content.svelte';
	import CardHeader from '../ui/card/card-header.svelte';
	import CardTitle from '../ui/card/card-title.svelte';
	import Card from '../ui/card/card.svelte';
	import { db } from '$lib/db';
	import Badge from '../ui/badge/badge.svelte';
	import Label from '../ui/label/label.svelte';
	import RegiCreateForm from '$lib/components/RegiCreateForm.svelte';

	export let regi: Group;
	export let forUpdate: boolean = false;

	$: rate = liveQuery(() => db.rates.where({ id: regi.rate_unit_id }).toArray());
	$: stock = liveQuery(() => db.storage_unit.where({ id: regi.storage_unit_id }).toArray());
</script>

<Card>
	<CardHeader>
		<CardTitle class="flex justify-between"
			>{regi.name}
			<div class="flex items-center gap-2">
				<Badge
					variant="outline"
					class="border {regi.currently_used
						? 'border-green-400 text-green-600'
						: 'border-yellow-400 text-yellow-600'}"
					>{regi.currently_used ? 'Active' : 'not in Use'}</Badge
				>
				{#if forUpdate}
					<RegiCreateForm useForUpdaate={true} bind:data={regi}></RegiCreateForm>
				{/if}
			</div></CardTitle
		>
	</CardHeader>

	{#if $rate}
		<CardContent class="flex flex-col gap-2 ">
			<div class="mr-2 flex justify-between">
				{#if $stock}
					<a href="/stocks/{regi.storage_unit_id}">
						<div>
							<Label>Stock:</Label>
							{$stock[0].name}
						</div>
					</a>
				{/if}

				<div>
					<a href="/rates/{regi.rate_unit_id}">
						<Label>Rate:</Label>
						{$rate[0].name}
					</a>
				</div>
			</div>

			<div class="mt-2 flex gap-2" id="used_ anaj_list">
				<Label>Anajs:</Label>
				<div class="flex flex-wrap gap-2">
					{#each $rate[0].used_anaj || [] as anaj}
						<Badge variant="outline">{anaj}</Badge>
					{/each}
				</div>
			</div>
		</CardContent>
	{/if}
</Card>
