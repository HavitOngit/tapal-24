<script lang="ts">
	import * as Table from '$lib/components/ui/table';

	export let ratelist;
	export let anajlist;
	export let forInit: boolean = true;
	export let deleteMode: boolean = true;

	$: ratelist = temp_anajlist;
	// tempo

	import { DeleteIcon } from 'lucide-svelte';
	import Input from './ui/input/input.svelte';
	import Button from './ui/button/button.svelte';

	let temp_anajlist = anajlist;
	if (forInit) {
		temp_anajlist = anajlist.map((obj: any) => {
			return { name: obj.name, rate: 0 };
		});
	}

	function remove(index: number) {
		const slice = temp_anajlist.splice(index, 1);
		temp_anajlist = temp_anajlist;
	}
</script>

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head class="w-[100px]" />
			<Table.Head></Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each temp_anajlist as anaj, i}
			<Table.Row>
				<Table.Cell class="font-medium">{anaj.name}</Table.Cell>
				<Table.Cell class="flex justify-evenly"
					><Input bind:value={anaj.rate} placeholder="enter rate" />

					{#if deleteMode}
						<Button
							variant="secondary"
							on:click={() => {
								remove(i);
							}}
						>
							X
						</Button>
					{/if}
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
