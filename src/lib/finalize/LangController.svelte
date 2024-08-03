<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { t, locale, locales } from 'svelte-intl-precompile';
	import * as Select from '$lib/components/ui/select';
	import { onMount } from 'svelte';
	import dayjs from 'dayjs';
</script>

<!-- {#each $locales as loc}
	<Button type="button" on:click={() => ($locale = loc)}>{loc}</Button>
{/each} -->
<div class="m-2 grid grid-cols-2 gap-3">
	<p class="text-center text-xl font-semibold">{$t('Language')}</p>

	<Select.Root
		onSelectedChange={(v) => {
			$locale = String(v?.value);
			localStorage.setItem('locale', $locale);
		}}
	>
		<Select.Trigger class="">
			{$t($locale)}
		</Select.Trigger>
		<Select.Content>
			<Select.Group>
				<Select.Label>{$t('Languages')}</Select.Label>
				{#each $locales as loc}
					<Select.Item value={loc} label={loc}>{$t(loc)}</Select.Item>
				{/each}
			</Select.Group>
		</Select.Content>
	</Select.Root>
</div>
