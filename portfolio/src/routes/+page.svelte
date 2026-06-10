<script lang="ts">
	import { projects, type Project } from '$lib/projects';
	import ProjectRow from '$lib/components/ProjectRow.svelte';
	import HoverPreview from '$lib/components/HoverPreview.svelte';

	const selected = projects.slice(0, 3);

	/* Cursor-following hero-image preview, active only over the
	   Selected Work list. State lives at the section level so a
	   single preview element tracks across rows without remounting. */
	let hovered: Project | null = $state(null);
	let mouseX = $state(0);
	let mouseY = $state(0);
</script>

<svelte:head>
	<title>Micaela · Four times the first designer in the room</title>
	<meta
		name="description"
		content="Selected work by Micaela, product designer in Lisbon. Research, systems, and the products that come out the other side."
	/>
</svelte:head>

<section class="px-5 sm:px-6 md:px-12 pt-10 sm:pt-16 md:pt-24 pb-20 sm:pb-28">
	<div class="grid grid-cols-12 gap-x-4 sm:gap-x-6 gap-y-6">
		<p class="eyebrow col-span-12 md:col-span-3 md:pt-4">
			Portfolio<br />
			<span class="text-[var(--color-muted)] font-normal normal-case tracking-normal">
				Vol. 01 · 2026
			</span>
		</p>

		<h1 class="display-xl col-span-12 md:col-span-9">
			Product Designer, <em class="italic">Research Nerd &amp; Vibe-Code Curious</em>
		</h1>
	</div>

	<div class="grid grid-cols-12 gap-x-4 sm:gap-x-6 mt-12 sm:mt-16">
		<p
			class="col-span-12 md:col-span-9 md:col-start-4 font-serif text-2xl md:text-3xl leading-[1.2] max-w-[34ch]"
		>
			Four times the first designer in the room.
		</p>
	</div>

	<div class="grid grid-cols-12 gap-x-4 sm:gap-x-6 mt-16 sm:mt-24">
		<p class="col-span-12 md:col-span-6 md:col-start-7 text-lg leading-[1.65] max-w-[44ch]">
			Systems, research, culture, team, and the products that come out the other side. I connect
			craft to the decisions that move a business. Sometimes that means a new revenue stream.
			Sometimes it means getting the CTO into a design workshop. Usually both.
		</p>
	</div>
</section>

<section class="px-5 sm:px-6 md:px-12 pb-20 sm:pb-28">
	<div class="flex items-baseline justify-between eyebrow">
		<span>Selected Work</span>
		<a
			href="/work"
			class="underline underline-offset-[6px] decoration-1 inline-flex items-center min-h-[2.5rem] py-1"
		>
			All projects →
		</a>
	</div>

	<ul
		class="mt-8 sm:mt-12 flex flex-col"
		onmousemove={(e) => {
			mouseX = e.clientX;
			mouseY = e.clientY;
		}}
		onmouseleave={() => (hovered = null)}
	>
		{#each selected as project}
			<li onmouseenter={() => (hovered = project)}>
				<ProjectRow {project} size="lg" />
			</li>
		{/each}
	</ul>
</section>

<HoverPreview image={hovered?.heroImage} title={hovered?.title} x={mouseX} y={mouseY} />

<section
	class="px-5 sm:px-6 md:px-12 pb-20 sm:pb-28 grid grid-cols-12 gap-x-4 sm:gap-x-6 gap-y-6"
>
	<p class="eyebrow col-span-12 md:col-span-3">Currently</p>
	<div
		class="col-span-12 md:col-span-9 font-serif text-2xl md:text-3xl leading-[1.2] max-w-[40ch]"
	>
		Lead Product Designer at <span class="italic">Indie Campers</span>. Designing across a global
		road-trip platform of 10,000+ vehicles in 20+ countries.
	</div>
</section>
