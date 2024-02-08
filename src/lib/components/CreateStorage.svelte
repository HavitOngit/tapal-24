<script lang="ts">
	import type { Anajlist_init, Storage_Anajs } from '$lib/custom_types';
	import { db } from '$lib/db';
	import AnajSelection from './AnajSelection.svelte';

	let selected_anaj: Storage_Anajs[] = [];
</script>

selected
<div class="flex flex-col">
	{#each selected_anaj as anaj}
		<h2>{anaj.name}</h2>
	{/each}
</div>

<AnajSelection bind:selected={selected_anaj}></AnajSelection>

<button on:click={() => console.log(selected_anaj)}>save</button>
