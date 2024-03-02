<script lang="ts">
	import Hajrislot from '$lib/components/daily/hajrislot.svelte';
	import { liveQuery } from 'dexie';
	import type { PageData } from './$types';
	import { db } from '$lib/db';
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import Card from '$lib/components/ui/card/card.svelte';

	export let data: PageData;

	const regs = liveQuery(() => db.group.toArray());

	let LastDate = liveQuery(() => db.usage.orderBy('date').last());

	$: console.log($LastDate);
</script>

{#if $LastDate || true}
	<div class="m-2 flex flex-col gap-2">
		{#each $regs || [] as reg}
			{#if reg.currently_used}
				<Hajrislot data={reg} LastDate={$LastDate?.date}></Hajrislot>
			{/if}
		{/each}
	</div>
{/if}
