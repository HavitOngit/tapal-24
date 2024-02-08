<script lang="ts">
	import { db } from '$lib/db';

	let name: string;
</script>

<input type="text" bind:value={name} class="border-cyan-950" />
<button
	on:click={async () => {
		await db.group.add({ name: name, storage_unit_id: 1 });
	}}>ADD</button
>
