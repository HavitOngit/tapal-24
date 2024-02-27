<script lang="ts">
	import { db } from '$lib/db';
	import * as Card from '$lib/components/ui/card';
	import Input from './ui/input/input.svelte';
	import Button from './ui/button/button.svelte';
	import Rateform from './Rateform.svelte';
	import { liveQuery } from 'dexie';
	import { onMount } from 'svelte';
	import type { Rate, oneRate } from '$lib/custom_types';
	import { anajlist } from '$lib/predefined';
	import type { CarouselAPI } from '$lib/components/ui/carousel/context';
	import * as Carousel from '$lib/components/ui/carousel/index.js';

	import { Footer } from './ui/alert-dialog';
	import { SaveIcon } from 'lucide-svelte';

	// for rate profile
	let next = false;
	let name: string;
	let ratelist: oneRate[];
	let rateProfile_id: number = 1;
	export let api: CarouselAPI;

	const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
	const preDATA = days.map((name) => {
		return { day: name, ratelist: [] };
	});
	let current_day = 0;

	const allUsedAnajs = new Map();

	// resume for days if form half copleted
	let isSaving = false;
	async function Save() {
		isSaving = true;

		// saving profile name to db
		const id = await db.rates.add({ name: name });
		rateProfile_id = parseInt(id);

		const DATA = await preDATA.map((obj) => {
			obj.ratelist.forEach((item) => {
				allUsedAnajs.set(item.name, true);
				item.rate = parseInt(item.rate);
			});

			return {
				...obj,
				rate_unit_id: rateProfile_id
			};
		});

		const usedAnajlist = allUsedAnajs.keys().toArray();

		const status = await db.rate.bulkAdd(DATA);
		if (status) {
			await db.rates.update(rateProfile_id, { used_anaj: usedAnajlist });
			isSaving = false;
			saved = true;
		}
	}

	function Next() {
		window.preDATA = preDATA;
		if (current_day < 7) {
			current_day += 1;
			api.scrollNext();
		}
	}

	function Back() {
		if (current_day > 0) {
			current_day -= 1;
			api.scrollPrev();
		}
	}

	let saved = false;
</script>

<!-- {#if !next}
			<Input type="text" bind:value={name} />
		{:else}
			{days[current_day]}
			<Rateform bind:ratelist {anajlist}></Rateform>
		{/if}

		<Button on:click={Save}>Save</Button> -->
<!-- {days[current_day]} -->
<div class="flex w-full flex-col">
	<div>
		<Carousel.Root bind:api>
			<Carousel.Content>
				{#each preDATA as obj}
					<Carousel.Item>
						<Card.Root>
							<Card.Content>
								{#if isSaving}
									<div class="flex min-h-96 items-center justify-center">
										{#if saved}
											<div>saved</div>
										{:else}
											Saving...
										{/if}
									</div>
								{:else}
									{obj.day}
									<Rateform bind:ratelist={obj.ratelist} {anajlist}></Rateform>
								{/if}
							</Card.Content>
						</Card.Root>
					</Carousel.Item>
				{/each}
			</Carousel.Content>
		</Carousel.Root>
	</div>
</div>

<div class="fixed bottom-24 w-full">
	<div class="mx-4 flex justify-between">
		<Button variant="outline" on:click={Back}>Back</Button>

		{#if current_day == 6}
			<Button on:click={Save} class=" w-[50%] rounded-xl"
				><SaveIcon class="mr-2 size-6"></SaveIcon> Save</Button
			>
		{:else}
			<Button on:click={Next}>Next</Button>
		{/if}
	</div>
</div>
