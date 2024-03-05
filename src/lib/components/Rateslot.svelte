<script lang="ts">
	import type { Rate, oneRate } from '$lib/custom_types';
	import * as Card from '$lib/components/ui/card';
	import Rateform from './Rateform.svelte';
	import Button from './ui/button/button.svelte';
	import RateEdit from './RateEdit.svelte';

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

<div class="w-full rounded-sm border border-gray-300 p-2">
	<div class="flex h-20 items-start justify-between p-2">
		<div class="text-2xl">{rateDetails.day}</div>
		<!-- <Button variant="outline">Edit</Button> -->
		<RateEdit Ratedetails={rateDetails}></RateEdit>
	</div>
	<hr />

	<div class="flex flex-col p-4">
		{#each rateDetails.ratelist as rate}
			<div class="flex justify-between">
				<div>{rate.name}</div>
				<div>{rate.rate}</div>
			</div>
		{/each}
	</div>
</div>
