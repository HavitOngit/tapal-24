<script>
import { t } from 'svelte-intl-precompile';
</script>
<div class="fixed flex h-full w-full items-center justify-center">
	<div class="flex flex-col items-center justify-center gap-3">
		<div class="size-7 animate-spin rounded-full border-b-2 border-t-2 border-gray-900"></div>
		<p class="font-semibold">{$t("Loading...")}</p>
	</div>
</div>
