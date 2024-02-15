<script lang="ts">
	import { db } from '$lib/db';
	import * as Card from '$lib/components/ui/card';
	import Input from './ui/input/input.svelte';
	import Button from './ui/button/button.svelte';
	import Rateform from './Rateform.svelte';
	import { liveQuery } from 'dexie';
	import { onMount } from 'svelte';
	import type { Rate, oneRate } from '$lib/custom_types';

	// for rate profile
	let next = false;
	let name: string;
	let ratelist: oneRate[];
	export let rateProfile_id: number = 1;

	const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
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

	let show_continue = false;
	// onMount(async () => {
	// 	saved_days = await db.rate.where({ rate_unit_id: rateProfile_id }).toArray();
	// 	if (saved_days.length > 0) {
	// 		show_continue = true;
	// 	}
	// });
</script>

<Card.Root>
	<Card.Content>
		{#if !next}
			<Input type="text" bind:value={name} />
		{:else if svaedData.has('Sun')}
			<div class="text-xl">✅ Done</div>
		{:else}
			{days[current_day]}
			<Rateform bind:ratelist></Rateform>
		{/if}

		<Button on:click={Save}>Save</Button>
	</Card.Content>
</Card.Root>
