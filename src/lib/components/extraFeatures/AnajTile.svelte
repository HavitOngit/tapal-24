<script lang="ts">
	import type { Usage } from '$lib/custom_types';

	export let UsageData: Usage;
</script>

<div class="flex min-w-20 flex-col items-center gap-1 rounded-md border p-3">
	<div class="text-xl font-semibold">
		{Number(UsageData.amount.toFixed(3))}
	</div>
	<div class="text-gray-500">
		{UsageData.name}
	</div>
</div>
