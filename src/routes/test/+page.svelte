<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	async function testPost() {
		const res = await fetch('/onlineDB', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ title: 'test' })
		});
		const data = await res.json();
		console.log(data);
	}
</script>

<Button on:click={testPost}>Test POST</Button>
<div class="flex flex-col gap-3">
	{#each data.entries || [] as entry}
		<p>
			{entry.id}-- {entry.title}
		</p>
	{/each}
</div>
