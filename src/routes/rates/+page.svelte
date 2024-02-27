<script lang="ts">
	import Rateinit from '$lib/components/Rateinit.svelte';
	import { db } from '$lib/db';
	import PlusButton from '$lib/finalize/PlusButton.svelte';

	import { liveQuery } from 'dexie';

	const rates = liveQuery(() => db.rates.toArray());
</script>

{#each $rates || [] as unit}
	<a href="/rates/{unit.id}">
		<div>
			{unit.name}
		</div>
	</a>
{/each}

<PlusButton></PlusButton>
