<script lang="ts">
	import type { Rate, oneRate } from '$lib/custom_types';
	import * as Card from '$lib/components/ui/card';
	import Rateform from './Rateform.svelte';
	import Button from './ui/button/button.svelte';

	export let rateDetails: Rate;
	let currentRates: oneRate[];
	let editMode = false;
</script>

<Card.Root class="m-2">
	<Card.Header class="flex flex-row justify-between">
		<div>
			{rateDetails.day}
		</div>
		<Button
			variant="outline"
			on:click={() => {
				editMode = !editMode;
			}}
		>
			Edit
		</Button>
	</Card.Header>
	<Card.Content>
		<Rateform
			forInit={false}
			ratelist={currentRates}
			anajlist={rateDetails.ratelist}
			bind:deleteMode={editMode}
		></Rateform>
	</Card.Content>
</Card.Root>
