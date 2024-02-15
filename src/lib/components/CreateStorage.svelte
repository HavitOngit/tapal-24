<script lang="ts">
	import type { Anajlist_init, Storage_Anajs, Storage, StorageUnit } from '$lib/custom_types';
	import { db } from '$lib/db';
	import AnajSelection from './AnajSelection.svelte';
	import { anajlist } from '$lib/predefined';
	import Input from './ui/input/input.svelte';
	import AnajSlot from './AnajSlot.svelte';
	import Button from './ui/button/button.svelte';
	import { liveQuery } from 'dexie';
	import { onMount } from 'svelte';

	let selected_anaj: Storage[] = [];

	let storage_unit: StorageUnit = { name: '' };

	// async function handle_univarsal_list(name: string) {
	// 	if (!univarsalList.has(name)) {
	// 		univarsalList.set(name, true);
	// 		await db.univarsalList.add({ name: name });
	// 	}
	// }
	const unimap = new Map();

	onMount(async () => {
		const list = await db.univarsalList.toArray();
		list.forEach((obj) => unimap.set(obj.name, obj.id));
	});

	let newUniList: any = [];
	async function save() {
		const unit = await db.storage_unit.put(storage_unit);

		// set ref of storage unit
		await selected_anaj.forEach((obj) => {
			obj.storage_unit_id = unit;
			if (!unimap.has(obj.name)) {
				newUniList.push({ name: obj.name });
				unimap.set(obj.name, true);
			}
		});

		console.log(newUniList);

		const anajs = await db.storage.bulkAdd(selected_anaj);
		const uniupload = await db.univarsalList.bulkAdd(newUniList);
		if (uniupload) {
			newUniList = [];
		}
		// const addtounivarasal = selected_anaj.map((obj) => handle_univarsal_list(obj.name));
		// console.log(addtounivarasal);
	}
</script>

<Input name="name" type="text" max="50" bind:value={storage_unit.name} class="m-1" />

Selected Anaj:
{#each selected_anaj as anaj}
	<AnajSlot bind:anaj></AnajSlot>
{/each}

<AnajSelection bind:selected={selected_anaj}></AnajSelection>

<Button on:click={save}>Create</Button>

<Button on:click={() => console.log(newUniList, unimap)}>TEST</Button>

<!-- selected
<div class="flex flex-col">
	{#each selected_anaj as anaj}
		<h2>{anaj.name}</h2>
	{/each}
</div>

<AnajSelection bind:selected={selected_anaj}></AnajSelection>

<button on:click={() => console.log(selected_anaj)}>save</button> -->
