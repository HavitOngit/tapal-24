<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';

	export let data: PageData;
</script>

<a href="/reg/{$page.params.id}/view">
	{$page.params.id}
</a>
