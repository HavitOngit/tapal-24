<script lang="ts">
	import * as Table from '$lib/components/ui/table';

	export let ratelist;

	$: ratelist = temp_anajlist;
	// tempo
	import { anajlist } from '$lib/predefined';
	import { DeleteIcon } from 'lucide-svelte';
	import Input from './ui/input/input.svelte';
	import Button from './ui/button/button.svelte';

	let temp_anajlist = anajlist.map((obj) => {
		return { name: obj.name, rate: 0 };
	});

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
			<Table.Head class="w-[30px]" />
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each temp_anajlist as anaj, i}
			<Table.Row>
				<Table.Cell class="font-medium">{anaj.name}</Table.Cell>
				<Table.Cell><Input bind:value={anaj.rate} placeholder="enter rate" /></Table.Cell>
				<Table.Cell
					><Button
						on:click={() => {
							remove(i);
						}}
					>
						X
					</Button>
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
