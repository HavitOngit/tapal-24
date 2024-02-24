<script lang="ts">
	import CreateStorage from '$lib/components/CreateStorage.svelte';
	import type { PageData } from './$types';
	import { db } from '$lib/db';
	import { liveQuery } from 'dexie';
	import PlusButton from '$lib/finalize/PlusButton.svelte';

	const storage_units = liveQuery(() => db.storage_unit.toArray());
</script>

<div>
	{#each $storage_units || [] as unit}
		<a href="/stocks/{unit.id}">
			{unit.name}
		</a>
	{/each}
</div>

<PlusButton>
	<CreateStorage></CreateStorage>
</PlusButton>
