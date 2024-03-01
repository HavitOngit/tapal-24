<script lang="ts">
	import type { Anajlist_init, Storage } from '$lib/custom_types';

	import AnajCard from './AnajCard.svelte';
	import Button from './ui/button/button.svelte';
	import * as Drawer from '$lib/components/ui/drawer';
	import Input from './ui/input/input.svelte';
	import { Plus } from 'lucide-svelte';

	export let selected: any = [];
	export let anajlist: any;
	export let useForRates: boolean = false;

	export let cache = new Map();

	selected.forEach((obj) => cache.set(obj.name, true));

	function addToList(name: string, rate: number = 0) {
		if (!cache.has(name)) {
			cache.set(name, true);
			if (useForRates) {
				selected = [...selected, { name: name, rate: rate }];
			} else {
				selected = [...selected, { name: name, amount: 0, storage_unit_id: 0 }];
			}
		} else {
			cache.delete(name);
			selected = selected.filter((obj) => obj.name !== name);
		}
	}

	let addingNewField = false;
	let name: string = '';
	let amount: number = 0;
</script>

<Drawer.Root>
	<Drawer.Trigger>
		<Button>
			<Plus class="mr-2 size-4"></Plus>
			Add
		</Button>
	</Drawer.Trigger>
	<Drawer.Content>
		{#if !useForRates}
			<div class="flex justify-end">
				<Button
					on:click={() => {
						addingNewField = !addingNewField;
					}}>{addingNewField ? 'Cancel' : 'Add'}</Button
				>
			</div>
		{/if}
		{#if addingNewField}
			<div class="flex">
				<Input bind:value={name} placeholder="Enter Name" />
			</div>
			<Button
				on:click={() => {
					addToList(name, amount);
					addingNewField = false;
					anajlist = [...anajlist, { name: name, amount: amount }];
				}}>Create</Button
			>
		{:else}
			<div class="grid grid-cols-2 gap-1">
				{#each anajlist as anaj}
					{#if anaj}
						<div on:click={() => addToList(anaj.name)}>
							<AnajCard {anaj} btn_clicked={cache.has(anaj.name)}></AnajCard>
						</div>
					{/if}
				{/each}
			</div>
		{/if}

		<Drawer.Footer>
			<Drawer.Close>Done</Drawer.Close>
		</Drawer.Footer>
	</Drawer.Content>
</Drawer.Root>
