<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import { onMount } from 'svelte';
	import { t } from 'svelte-intl-precompile';

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
			{$t(list.find((m) => m.value === selected)?.label || 'loading...')}
		{/if}
	</Select.Trigger>
	<Select.Content>
		<Select.Group>
			<Select.Label>{$t(groupName)}</Select.Label>
			{#each list as item}
				<Select.Item value={item.value} label={item.label}>{$t(item.label)}</Select.Item>
			{/each}
		</Select.Group>
	</Select.Content>
</Select.Root>
