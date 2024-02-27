<script lang="ts">
	import Rateinit from '$lib/components/Rateinit.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="m-2 flex items-center justify-center">
	<Rateinit></Rateinit>
</div>
