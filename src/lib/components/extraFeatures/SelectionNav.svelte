<script lang="ts">
	import { Trash2Icon, XIcon } from 'lucide-svelte';
	import Label from '../ui/label/label.svelte';

	export let selected_length: number;
	export let deleteMode: boolean;

	export let deletBtn: HTMLButtonElement;
</script>

<div class="m-2 flex justify-between">
	<div class="flex gap-2">
		<button
			on:click={() => {
				deleteMode = false;
			}}
		>
			<XIcon class="h-6 w-6" />
		</button>

		<div>
			<Label class="text-xl">{selected_length} selected</Label>
		</div>
	</div>
	<div class="flex items-center">
		<button
			on:click={() => {
				deletBtn.click();
			}}
		>
			<Trash2Icon class="h-6 w-6" />
		</button>
	</div>
</div>
