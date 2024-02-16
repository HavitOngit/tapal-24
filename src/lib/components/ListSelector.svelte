<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import type { Selector, Storage_Anajs } from '$lib/custom_types';
	import Button from './ui/button/button.svelte';

	export let list: Selector[];
	export let name: string;
	export let selected: number;
</script>

<Select.Root>
	<Select.Trigger class="w-[180px]">
		<Select.Value placeholder="Select a {name}" />
	</Select.Trigger>
	<Select.Content>
		<Select.Group>
			<Select.Label>{name}</Select.Label>
			{#each list as item}
				{#if item}
					<Select.Item value={item.id} label={item.name} on:click={() => (selected = item.id)}
						>{item.name}</Select.Item
					>
				{/if}
			{/each}
		</Select.Group>
	</Select.Content>
	<Select.Input {name} />
</Select.Root>

<Button
	on:click={() => {
		console.log(selected);
	}}>Status</Button
>
