<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import UpdateEntry from '$lib/components/extraFeatures/updateEntry.svelte';

	export let data: PageData;
</script>

<a href="/reg/{$page.params.id}/view">
	{$page.params.id}
</a>

<UpdateEntry group_id={Number($page.params.id)}></UpdateEntry>
