<script lang="ts">
	import { page } from '$app/stores';
	import UpdateEntry from '$lib/components/extraFeatures/UpdateEntry.svelte';
</script>

{$page.params.id}
<UpdateEntry group_id={Number($page.params.id)}></UpdateEntry>
