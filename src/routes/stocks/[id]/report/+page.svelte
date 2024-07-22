<script lang="ts">
	import { liveQuery } from 'dexie';
	import type { PageData } from './$types';
	import { db } from '$lib/db';
	import { page } from '$app/stores';

	export let data: PageData;
	const id = parseInt($page.params.id);

	const history = liveQuery(() => db.storage_history.where({ storage_unit_id: id }).toArray());

	$: console.log($history);
</script>

Storage report
