<script lang="ts">
import { t } from 'svelte-intl-precompile';
	import * as Drawer from '$lib/components/ui/drawer';
	import { PackagePlus } from 'lucide-svelte';
	import toast from 'svelte-french-toast';
	import AnajCard from './AnajCard.svelte';
	import Button from './ui/button/button.svelte';
	import Input from './ui/input/input.svelte';

	export let selected: any = [];
	export let anajlist: any;
	export let useForRates: boolean = false;
	export let TriggerButton: HTMLButtonElement;
	export let forStorageView: boolean = false;

	export let cache = new Map();

	selected.forEach((obj: { name: string }) => cache.set(obj.name, true));

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
			selected = selected.filter((obj: { name: string }) => obj.name !== name);
		}
	}

	let addingNewField = false;
	let name: string = '';
	let amount: number = 0;
	let nameError = false;
</script>

<Drawer.Root>
	<Drawer.Trigger bind:el={TriggerButton} class="flex">
		{#if !forStorageView}
			<Button variant="outline" class=" w-[100%] gap-2">
				<PackagePlus />
				<p>{$t("Click To Add")}</p>
			</Button>
		{/if}
	</Drawer.Trigger>
	<Drawer.Content>
		<div class="flex max-h-96 flex-col overflow-y-auto">
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
						{/if}
					</div>
				{/if}
				{#if addingNewField}
					<div class="mx-4 flex h-24">
						<Input bind:value={name} placeholder="Enter Name" />
						{#if nameError}
							<p>{$t("type something")}</p>
						{/if}
					</div>
					<Button
						class="w-full"
						on:click={() => {
							if (name.length <= 0) {
								toast.error('Enter Something');
								return;
							}
							if (cache.has(name)) {
								return;
							}
							addToList(name, amount);
							addingNewField = false;
							anajlist = [...anajlist, { name: name, amount: amount }];
						}}>{$t("Create")}</Button
					>
				{:else}
					<div class="grid max-h-[60%] grid-cols-2 gap-1 overflow-y-auto">
						{#each anajlist as anaj}
							{#if anaj}
								<div on:click={() => addToList(anaj.name)}>
									<AnajCard {anaj} btn_clicked={cache.has(anaj.name)}></AnajCard>
								</div>
							{/if}
						{/each}
						<Button
							variant="outline"
							class="h-auto min-h-32 bg-blue-50"
							on:click={() => {
								addingNewField = !addingNewField;
							}}
						>
							Create New
						</Button>
					</div>
				{/if}
			</div>
			<div>
				<Drawer.Footer>
					{#if !addingNewField}
						<Drawer.Close><Button class="w-full">{$t("Done")}</Button></Drawer.Close>
					{/if}
				</Drawer.Footer>
			</div>
		</div></Drawer.Content
	>
</Drawer.Root>
