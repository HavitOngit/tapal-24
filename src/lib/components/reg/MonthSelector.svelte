<script lang="ts">
	import * as Select from '$lib/components/ui/select';

	export let selected: number;
	export let groupName: string;
	export let list: { value: number | string; label: string }[];
</script>

<Select.Root
	onSelectedChange={(v) => {
		selected = Number(v?.value);
	}}
>
	<Select.Trigger class="">
		{#if list.length > 0}
			<Select.Value placeholder={list.filter((m) => m.value === selected)[0].label} />
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
