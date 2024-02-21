<script lang="ts">
	import Rateinit from '$lib/components/Rateinit.svelte';
	import { db } from '$lib/db';

	import { liveQuery } from 'dexie';

	const rates = liveQuery(() => db.rates.toArray());

</script>

{#each $rates || [] as unit}
	{#if unit.completed}
		<a href="/rates/{unit.id}">
			<div>
				{unit.name}
			</div>
		</a>
	{/if}
{/each}

<Rateinit></Rateinit>
