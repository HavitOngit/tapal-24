<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import { Columns, Sticker } from 'lucide-svelte';

	type usageData = {
		name: string;
		amount: number;
	};
	export let usageData: usageData[];
	export let Rates: any[];
</script>

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head class="w-[100px]" />
			<Table.Head>amount</Table.Head>

			<Table.Head>Rate</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each usageData as usage}
			<Table.Row>
				<Table.Cell class="font-medium">{usage.name}</Table.Cell>
				<Table.Cell>{usage.amount}kg</Table.Cell>
				<Table.Cell>{Number(Rates.find((obj) => obj.name == usage.name).rate)}</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
