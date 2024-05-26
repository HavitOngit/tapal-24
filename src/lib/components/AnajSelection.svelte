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
	export let TriggerButton: HTMLButtonElement;

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
	<Drawer.Trigger bind:el={TriggerButton}></Drawer.Trigger>
	<Drawer.Content>
		<div class="mx-2">
			{#if !useForRates}
				<div class="mx-2 my-4 flex justify-end">
					{#if addingNewField}
						<Button
							variant="secondary"
							on:click={() => {
								addingNewField = !addingNewField;
							}}>cancel</Button
						>
					{:else}
						<Button
							on:click={() => {
								addingNewField = !addingNewField;
							}}>Add</Button
						>
					{/if}
				</div>
			{/if}
			{#if addingNewField}
				<div class="mx-4 flex h-24">
					<Input bind:value={name} placeholder="Enter Name" />
				</div>
				<Button
					class="w-full"
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
		</div>
		<Drawer.Footer>
			<Drawer.Close>Done</Drawer.Close>
		</Drawer.Footer>
	</Drawer.Content>
</Drawer.Root>
