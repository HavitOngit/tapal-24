<script lang="ts">
import { t } from 'svelte-intl-precompile';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Plus } from 'lucide-svelte';
</script>

<div class="fixed bottom-24 right-3">
	<AlertDialog.Root>
		<AlertDialog.Trigger class=" flex size-14 items-center justify-center rounded-lg bg-blue-200"
			><Plus></Plus></AlertDialog.Trigger
		>
		<AlertDialog.Content>
			                                                                                                                                                                                                                                                                                                                                         

			<slot />
			<AlertDialog.Footer>
				<AlertDialog.Cancel>{$t("Cancel")}</AlertDialog.Cancel>
				                                                          
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>
</div>
