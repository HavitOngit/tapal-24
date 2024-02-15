<script lang="ts">
	import type { Rate, oneRate } from '$lib/custom_types';
	import * as Card from '$lib/components/ui/card';
	import Rateform from './Rateform.svelte';
	import Button from './ui/button/button.svelte';

	export let rateDetails: Rate;
	let currentRates: oneRate[];
</script>

<!-- <Card.Root>
	<Card.Header>
		{rateDetails.day}
	</Card.Header>
	<Card.Content>
		<Rateform forInit={false} ratelist={currentRates} anajlist={rateDetails.ratelist}></Rateform>
	</Card.Content>
</Card.Root> -->

<div class="m-2 w-[80%] rounded-sm border border-gray-500 p-2">
	<div class="flex justify-between">
		<div class="text-lg">{rateDetails.day}</div>
		<Button variant="outline">Edit</Button>
	</div>

	<div class="flex flex-col">
		{#each rateDetails.ratelist as rate}
			<div class="flex justify-between">
				<div>{rate.name}</div>
				<div>{rate.rate}</div>
			</div>
		{/each}
	</div>
</div>
