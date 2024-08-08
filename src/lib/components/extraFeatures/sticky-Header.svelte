<script lang="ts">
	import TableHead from '../ui/table/table-head.svelte';

	import TableHeader from '../ui/table/table-header.svelte';
	import TableRow from '../ui/table/table-row.svelte';
	import { t } from 'svelte-intl-precompile';

	export let headers = ['Date', 'Rate', 'Before', 'Usage', 'After'];
</script>

<table class="sticky top-0 w-full bg-white">
	<TableHeader>
		<TableRow>
			{#each headers as header}
				<TableHead>{$t(header)}</TableHead>
			{/each}
		</TableRow>
	</TableHeader>
</table>
