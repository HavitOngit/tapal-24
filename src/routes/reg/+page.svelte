<script lang="ts">
	import { liveQuery } from 'dexie';

	import { db } from '$lib/db';
	import RegiCreateForm from '$lib/components/RegiCreateForm.svelte';

	import PlusButtonAlert from '$lib/finalize/PlusButtonAlert.svelte';
	import type { RegForm } from '$lib/custom_types';

	const regilist = liveQuery(() => db.group.toArray());
</script>

{#each $regilist || [] as regi}
	<a href="/reg/{regi.id}">
		{regi.name}
	</a>
{/each}

<PlusButtonAlert>
	<RegiCreateForm></RegiCreateForm>
</PlusButtonAlert>
