<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Plus } from 'lucide-svelte';
	import { page } from '$app/stores';
</script>

<div class="fixed bottom-24 right-3">
	<a
		href="{$page.url.pathname}/create"
		class=" flex size-14 items-center justify-center rounded-lg bg-blue-200"
	>
		<Plus></Plus>
	</a>
</div>
