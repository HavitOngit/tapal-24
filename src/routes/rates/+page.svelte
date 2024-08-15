<script lang="ts">
	import RateProfile from '$lib/components/RateProfile.svelte';
	import Rateinit from '$lib/components/Rateinit.svelte';
	import { db } from '$lib/db';
	import PlusButton from '$lib/finalize/PlusButton.svelte';
	import { t } from 'svelte-intl-precompile';

	import { liveQuery } from 'dexie';

	const rates = liveQuery(() => db.rates.toArray());
</script>

<div class="m-3 my-5">
	<p class="text-xl font-bold">{$t('Rates')}</p>
</div>

<div class="m-2 flex flex-col gap-2">
	{#each $rates || [] as unit}
		<a href="/rates/{unit.id}">
			<RateProfile rate={unit}></RateProfile>
		</a>
	{/each}
</div>

<PlusButton></PlusButton>
