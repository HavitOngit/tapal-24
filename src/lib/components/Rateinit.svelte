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
	export let rateProfile_id: number = 1;
	export let api: CarouselAPI;

	const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
	const preDATA = days.map((name) => {
		return { day: name, ratelist: [], rate_unit_id: 0 };
	});
	let current_day = 0;

	const svaedData = new Map();

	// resume for days if form half copleted

	async function Save() {
		if (!next) {
			const id = await db.rates.add({ name: name, completed: false });
			rateProfile_id = parseInt(id);
			if (rateProfile_id) {
				next = true;
			}
			console.log(next, rateProfile_id);
		} else {
			// adding impo fields

			if (days[current_day] == 'Sun') {
				await db.rates.update(rateProfile_id, { completed: true });
			}

			const final_obj = {
				day: days[current_day],
				ratelist: ratelist,
				rate_unit_id: rateProfile_id
			};

			if (svaedData.has(days[current_day])) {
				final_obj.id = svaedData.get(days[current_day]);
			}

			const status = await db.rate.put(final_obj);
			console.log(status);

			if (status && !svaedData.has(days[current_day])) {
				svaedData.set(days[current_day], status);
			}
			if (status && !(days[current_day] == 'Sun')) {
				current_day += 1;
			}
		}
	}

	const visitedDays = new Map();
	let anajlist_Ref = [...anajlist];
	function Next() {
		window.preDATA = preDATA;
		if (current_day < 7) {
			visitedDays.set(days[current_day], ratelist);
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

	/**
	 * Problem: We have only one ratelist which is binded to all days
	 * so when any one day ratelist is changed we have to reset binded ratalist
	 * otherwise after that day all other day ratelist is effected
	 */
	function ratelistFIX() {}
	let ratelist_insi;
	let firstSub = true;

	let isSaving = false;
	let saved = false;

	async function SaveToDB() {
		isSaving = true;
		// storing rateProfile
		const id = await db.rates.add({ name: name, completed: false });
		rateProfile_id = parseInt(id);

		if (rateProfile_id) {
			// preparing data
			const data: Rate[] = [];
			await visitedDays.forEach((v, k) => {
				data.push({ day: k, ratelist: v, rate_unit_id: rateProfile_id });
			});

			const status = await db.rate.bulkAdd(data);

			if (status) {
				saved = true;
			}
		}
		isSaving = false;
	}

	let show_save_button = false;
	// onMount(async () => {
	// 	saved_days = await db.rate.where({ rate_unit_id: rateProfile_id }).toArray();
	// 	if (saved_days.length > 0) {
	// 		show_continue = true;
	// 	}
	// });
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
								{obj.day}
								<Rateform bind:ratelist={obj.ratelist} anajlist={anajlist_Ref}></Rateform>
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
			<Button on:click={SaveToDB} class=" w-[50%] rounded-xl"
				><SaveIcon class="mr-2 size-6"></SaveIcon> Save</Button
			>
		{:else}
			<Button on:click={Next}>Next</Button>
		{/if}
	</div>
</div>
