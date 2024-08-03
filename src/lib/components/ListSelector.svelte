<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import type { Selector, Storage_Anajs } from '$lib/custom_types';
	import Button from './ui/button/button.svelte';
	import { t } from 'svelte-intl-precompile';
	import Label from './ui/label/label.svelte';

	export let list: Selector[];
	export let name: string;
	export let selected: number;
	export let saved: number | undefined;

	const saved_name = list.find((item) => item.id == saved);
</script>

<div class="flex flex-col gap-1">
	<Label class="ml-2 text-left">{$t('Select')} {$t(name)}:</Label>
	<Select.Root>
		<Select.Trigger>
			<Select.Value placeholder={saved ? saved_name?.name : `Select a ${name}`} />
		</Select.Trigger>
		<Select.Content>
			<Select.Group>
				<Select.Label>{$t(name)}</Select.Label>
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
</div>
