<script lang="ts">
	import * as Table from '$lib/components/ui/table';

	export let ratelist: any;
	export let anajlist;
	export let forInit: boolean = true;
	export let deleteMode: boolean = true;

	// for delete binding

	let cache = new Map();

	let show = deleteMode ? '' : `disebled`;
	let fakeBtn: HTMLButtonElement;

	$: ratelist = temp_anajlist;

	// tempo

	import { Trash2 } from 'lucide-svelte';
	import Input from './ui/input/input.svelte';
	import Button from './ui/button/button.svelte';
	import AnajSelection from './AnajSelection.svelte';
	import { onMount } from 'svelte';
	import { db, type univarsalList } from '$lib/db';

	let temp_anajlist = anajlist;
	if (forInit) {
		temp_anajlist = anajlist.map((obj: any) => {
			return { name: obj.name, rate: 0 };
		});
	}

	function remove(index: number, name: string) {
		cache.delete(name);
		const slice = temp_anajlist.splice(index, 1);

		temp_anajlist = [...temp_anajlist];
	}

	let unilist: univarsalList[];
	onMount(async () => {
		unilist = await db.univarsalList.toArray();
	});
</script>

<p class="text-end text-sm font-semibold">All in grams</p>
<Table.Root>
	<Table.Header>
		<Table.Row></Table.Row>
	</Table.Header>

	<Table.Body>
		{#each temp_anajlist as anaj, i}
			<Table.Row>
				<Table.Cell class="font-medium">{anaj.name}</Table.Cell>
				<Table.Cell class="flex gap-2">
					{#if deleteMode}
						<Input bind:value={anaj.rate} type="number" placeholder="enter rate" />
					{:else}
						<div class=" w-52 pl-3">
							{anaj.rate}
						</div>
					{/if}

					{#if deleteMode}
						<Button
							class=" rounded-sm"
							variant="ghost"
							on:click={() => {
								remove(i, anaj.name);
							}}
						>
							<Trash2></Trash2>
						</Button>
					{/if}
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>

<AnajSelection
	TriggerButton={fakeBtn}
	anajlist={unilist}
	bind:selected={temp_anajlist}
	useForRates={true}
	bind:cache
></AnajSelection>
