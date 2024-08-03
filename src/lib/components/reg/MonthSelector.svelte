<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import { onMount } from 'svelte';

	export let selected: number;
	export let groupName: string;
	export let list: { value: number | string; label: string }[] = [];

	onMount(() => {
		console.log(list);
	});
</script>

<Select.Root
	onSelectedChange={(v) => {
		selected = Number(v?.value);
	}}
>
	<Select.Trigger class="">
		{#if list}
			<Select.Value placeholder={list.find((m) => m.value === selected)?.label} />
		{/if}
	</Select.Trigger>
	<Select.Content>
		<Select.Group>
			<Select.Label>{groupName}</Select.Label>
			{#each list as item}
				<Select.Item value={item.value} label={item.label}>{item.label}</Select.Item>
			{/each}
		</Select.Group>
	</Select.Content>
</Select.Root>
