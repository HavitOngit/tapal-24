<script lang="ts">
import { t } from 'svelte-intl-precompile';
	import CreateStorage from '$lib/components/CreateStorage.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { db } from '$lib/db';

	let name: string;
</script>

                                                                                                                                                                                                           

                                        
<div>
	<a href="/stocks">{$t("stocks")}</a>
</div>
<div>
	<a href="/rates">{$t("rates")}</a>
</div>
<div>``
	<a href="/reg">{$t("Registers")}</a>
</div>
<div>
	<a href="/dailywork">{$t("DailyWork")}</a>
</div>
<div>
	<a href="/backup">{$t("BackUp")}</a>
</div>
<Button
	class="mt-[95%]"
	variant="destructive"
	on:click={() => {
		window.indexedDB.deleteDatabase('AnajDB');
	}}>Delete DataBase</Button
>
