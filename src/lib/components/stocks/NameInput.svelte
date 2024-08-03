<script lang="ts">
import { t } from 'svelte-intl-precompile';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { onMount } from 'svelte';
	import { Input } from '../ui/input';
	import { Save } from 'lucide-svelte';

	export let name: string;
	export let TriggerButton: HTMLButtonElement;
	let SaveBtn: HTMLButtonElement;

	function seName() {
		name = 'ddddd';
	}

	onMount(() => {
		if (name.length == 0) {
			console.log({ name, trigger: 'Triggered from here' });

			TriggerButton.click();
		}
	});
	let CancelBtn: HTMLButtonElement;
</script>

<div id="alerts" hidden>
	<AlertDialog.Root>
		<AlertDialog.Trigger bind:el={TriggerButton}></AlertDialog.Trigger>
		<AlertDialog.Content>
			<AlertDialog.Header>
				<AlertDialog.Title>{$t("Name")}</AlertDialog.Title>
				<AlertDialog.Description>
					<form
						on:submit={() => {
							CancelBtn.click();
						}}
					>
						<Input bind:value={name} placeholder="Enter Storage name" />
					</form>
				</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				                                                                                          
				<AlertDialog.Action type="submit" bind:el={CancelBtn}>{$t("Save")}</AlertDialog.Action>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>
</div>
