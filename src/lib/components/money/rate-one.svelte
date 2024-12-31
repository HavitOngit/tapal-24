<script lang="ts">
	import type { MoneyRates } from '$lib/custom_types';
	import CardHeader from '../ui/card/card-header.svelte';
	import CardTitle from '../ui/card/card-title.svelte';
	import Card from '../ui/card/card.svelte';

	export let data: MoneyRates;
</script>

<Card>
	<CardHeader>
		<CardTitle class="flex justify-between">
			<p>{data.name}</p>
			<p class="text-gray-400">{data.total}</p>
		</CardTitle>
	</CardHeader>
</Card>
