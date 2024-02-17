<script lang="ts">
	import Hajrislot from '$lib/components/daily/hajrislot.svelte';
	import { liveQuery } from 'dexie';
	import type { PageData } from './$types';
	import { db } from '$lib/db';

	export let data: PageData;

	const regs = liveQuery(() => db.group.toArray());
</script>

{#each $regs || [] as reg}
	{#if reg.currently_used}
		<Hajrislot data={reg}></Hajrislot>
	{/if}
{/each}
