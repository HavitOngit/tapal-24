<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Plus } from 'lucide-svelte';
</script>

<div class="fixed bottom-24 right-3">
	<AlertDialog.Root>
		<AlertDialog.Trigger><Plus></Plus></AlertDialog.Trigger>
		<AlertDialog.Content>
			<!-- <AlertDialog.Header>
        <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
        <AlertDialog.Description>
          This action cannot be undone. This will permanently delete your account
          and remove your data from our servers.
        </AlertDialog.Description>
      </AlertDialog.Header> -->

			<slot />
			<AlertDialog.Footer>
				<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
				<!-- <AlertDialog.Action>Continue</AlertDialog.Action> -->
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>
</div>
