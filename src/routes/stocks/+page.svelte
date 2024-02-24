<script lang="ts">
	import CreateStorage from '$lib/components/CreateStorage.svelte';
	import type { PageData } from './$types';
	import { db } from '$lib/db';
	import { liveQuery } from 'dexie';

	const storage_units = liveQuery(() => db.storage_unit.toArray());
</script>

<div>
	{#each $storage_units || [] as unit}
		<a href="/stocks/{unit.id}">
			{unit.name}
		</a>
	{/each}
</div>

<!-- <CreateStorage></CreateStorage> -->
