<script lang="ts">
	let files: FileList;

	$: console.log(files);
</script>

<input type="file" bind:files accept=".tapal" />
