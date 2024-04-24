<script lang="ts">
	import { db } from '$lib/db';
	import { liveQuery } from 'dexie';

	let LastDate = liveQuery(() => db.usage.orderBy('date').last());
	$: console.log(LastDate);
</script>
