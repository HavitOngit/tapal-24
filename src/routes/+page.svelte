<script lang="ts">
	import CreateStorage from '$lib/components/CreateStorage.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { db } from '$lib/db';

	let name: string;
</script>

<!-- <input type="text" bind:value={name} class="border-cyan-950" />
<button
	on:click={async () => {
		await db.group.add({ name: name, storage_unit_id: 1, currently_used: true });
	}}>ADD</button
> -->

<!-- <CreateStorage></CreateStorage> -->
<div>
	<a href="/stocks">stocks</a>
</div>
<div>
	<a href="/rates">rates </a>
</div>

<Button
	class="mt-[95%]"
	variant="destructive"
	on:click={() => {
		window.indexedDB.deleteDatabase('AnajDB');
	}}>Delete DataBase</Button
>
