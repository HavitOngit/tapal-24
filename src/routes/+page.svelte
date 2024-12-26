<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { t } from 'svelte-intl-precompile';

	let name: string;
</script>

<div>
	<a href="/stocks">{$t('stocks')}</a>
</div>
<div>
	<a href="/rates">{$t('rates')}</a>
</div>
<div>
	``
	<a href="/reg">{$t('Registers')}</a>
</div>
<div>
	<a href="/dailywork">{$t('DailyWork')}</a>
</div>
<div>
	<a href="/backup">{$t('BackUp')}</a>
</div>
<Button
	class="mt-[95%]"
	variant="destructive"
	on:click={() => {
		window.indexedDB.deleteDatabase('AnajDB');
	}}>Delete DataBase</Button
>
