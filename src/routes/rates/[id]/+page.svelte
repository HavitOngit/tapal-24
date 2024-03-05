<script lang="ts">
	import { page } from '$app/stores';
	import { getAllUsedAnajs } from '$lib/api';
	import RateView from '$lib/components/RateView.svelte';
	import Rateslot from '$lib/components/Rateslot.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Popover, PopoverTrigger } from '$lib/components/ui/popover';
	import PopoverContent from '$lib/components/ui/popover/popover-content.svelte';
	import type { Rate } from '$lib/custom_types';
	import { db } from '$lib/db';
	import { liveQuery } from 'dexie';
	import { Pencil, PencilLine, Settings, Trash, Trash2 } from 'lucide-svelte';
	import Trash_2 from 'lucide-svelte/icons/trash-2';
	import { onMount } from 'svelte';
	import { parse } from 'svelte/compiler';

	const id = parseInt($page.params.id);

	const list = liveQuery(() => db.rate.where({ rate_unit_id: id }).toArray());
	$: rateUnit = liveQuery(() => db.rates.get(id));

	onMount(async () => {
		console.log(await getAllUsedAnajs(id));
	});
</script>

<div class="flex justify-end">
	<Popover>
		<PopoverTrigger>
			<button class="m-2">
				<Settings strokeWidth={1}></Settings>
			</button>
		</PopoverTrigger>
		<PopoverContent class="flex w-auto flex-col gap-2">
			<button class="flex items-center gap-2"><PencilLine></PencilLine> <span>Rename</span></button>
			<Button variant="destructive" class="flex items-center gap-2"
				><Trash2></Trash2><span> Delete </span>
			</Button>
		</PopoverContent>
	</Popover>
</div>
<div class="mx-3 flex flex-col items-center justify-center gap-2">
	<h1 class="text-2xl font-bold">Rate: {$rateUnit?.name}</h1>
	{#each $list || [] as detail}
		<!-- <RateView rateDetails={detail}></RateView> -->
		<Rateslot rateDetails={detail}></Rateslot>
	{/each}
</div>
