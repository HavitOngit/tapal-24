<script lang="ts">
	import type { Anajlist_init, Storage_Anajs, Storage, StorageUnit } from '$lib/custom_types';
	import { db } from '$lib/db';
	import AnajSelection from './AnajSelection.svelte';
	import { anajlist } from '$lib/predefined';
	import Input from './ui/input/input.svelte';
	import AnajSlot from './AnajSlot.svelte';
	import Button from './ui/button/button.svelte';

	let selected_anaj: Storage[] = [];

	let storage_unit: StorageUnit = { name: '' };

	async function save() {
		const unit = await db.storage_unit.put(storage_unit);
		await selected_anaj.forEach((obj) => (obj.storage_unit_id = unit));

		const anajs = await db.storage.bulkAdd(selected_anaj);

		console.log(selected_anaj);
	}
</script>

<Input name="name" type="text" max="50" bind:value={storage_unit.name} class="m-1" />

Selected Anaj:
{#each selected_anaj as anaj}
	<AnajSlot {anaj}></AnajSlot>
{/each}

<AnajSelection bind:selected={selected_anaj}></AnajSelection>

<Button on:click={save}>Create</Button>

<!-- selected
<div class="flex flex-col">
	{#each selected_anaj as anaj}
		<h2>{anaj.name}</h2>
	{/each}
</div>

<AnajSelection bind:selected={selected_anaj}></AnajSelection>

<button on:click={() => console.log(selected_anaj)}>save</button> -->
