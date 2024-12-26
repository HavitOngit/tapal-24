<script lang="ts">
	export let title: string;
	export let description: string;
	export let icon: string;
</script>

<div class="grid grid-cols-2">
	<div class="r flex">
		<!-- image -->
		<p class="text-9xl">{icon}</p>
	</div>
	<div>
		<h3>{title}</h3>
		<!-- <p>{description}</p> -->
	</div>
</div>
