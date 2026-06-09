<script lang="ts">
	import { projects } from '$lib/projects';
	import ProjectRow from '$lib/components/ProjectRow.svelte';
</script>

<svelte:head>
	<title>Work · Micaela</title>
	<meta
		name="description"
		content="Case studies by Micaela, product designer in Lisbon. Cord, Indie Campers, Tenzo."
	/>
</svelte:head>

<section class="px-5 sm:px-6 md:px-12 pt-10 sm:pt-16 md:pt-24 pb-10 sm:pb-12">
	<div class="grid grid-cols-12 gap-x-4 sm:gap-x-6 gap-y-6">
		<p class="eyebrow col-span-12 md:col-span-3">Index of work</p>
		<h1 class="display-xl col-span-12 md:col-span-9">
			Projects, <em class="italic">in full.</em>
		</h1>
	</div>
</section>

<section class="px-5 sm:px-6 md:px-12 pb-20 sm:pb-28">
	<ul class="flex flex-col">
		{#each projects as project}
			<li><ProjectRow {project} /></li>
		{/each}
	</ul>
</section>
