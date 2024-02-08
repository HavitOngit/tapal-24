<script lang="ts">
	import type { Anajlist_init } from '$lib/custom_types';
	import { db } from '$lib/db';
	import AnajSelection from './AnajSelection.svelte';

	let selected_anaj: Anajlist_init[];
</script>

<AnajSelection bind:selected={selected_anaj}></AnajSelection>

<button on:click={() => console.log(selected_anaj)}>save</button>
