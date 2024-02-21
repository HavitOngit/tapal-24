<script lang="ts">
	import * as Table from '$lib/components/ui/table';

	type usageData = {
		name: string;
		amount: number;
	};
	export let usageData: usageData[];
</script>

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head class="w-[100px]" />
			<Table.Head>amount</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each usageData as usage}
			<Table.Row>
				<Table.Cell class="font-medium">{usage.name}</Table.Cell>
				<Table.Cell>{usage.amount}</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
