<script lang="ts">
	import { type Group } from '$lib/custom_types';
	import { Car } from 'lucide-svelte';
	import CardHeader from '../ui/card/card-header.svelte';
	import Card from '../ui/card/card.svelte';
	import CardTitle from '../ui/card/card-title.svelte';

	export let RegData: Group;
</script>

{#if RegData}
	<Card class="">
		<CardHeader>
			<CardTitle>
				{RegData.name}
			</CardTitle>
		</CardHeader>
	</Card>
{/if}
