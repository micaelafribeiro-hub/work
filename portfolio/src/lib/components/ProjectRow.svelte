<script lang="ts">
	import type { Project } from '$lib/projects';

	let {
		project,
		size = 'md'
	}: { project: Project; size?: 'md' | 'lg' } = $props();

	/* Two title sizes: `lg` for the home page (denser, more visual punch),
	   `md` for the /work index (lighter, more cases visible at once). */
	const titleClass = $derived(size === 'lg' ? 'text-4xl md:text-5xl' : 'text-3xl md:text-4xl');
</script>

<a
	href={`/work/${project.slug}`}
	class="group block rule py-6 sm:py-10 md:py-12 grid grid-cols-12 gap-x-4 sm:gap-x-6 gap-y-3 md:items-baseline transition-colors duration-200 hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)] active:bg-[var(--color-ink)] active:text-[var(--color-paper)] -mx-5 sm:-mx-6 md:-mx-12 px-5 sm:px-6 md:px-12 min-h-[6rem]"
>
	<span class="eyebrow col-span-2 md:col-span-1 order-1 text-[var(--color-soft)]">
		{project.no}
	</span>
	<span
		class="eyebrow col-span-7 md:col-span-2 order-2 md:order-3 whitespace-nowrap text-[var(--color-muted)] group-hover:text-[var(--color-paper)]/80"
	>
		{project.role}
	</span>
	<span
		class="eyebrow col-span-3 md:col-span-2 order-3 md:order-4 text-right text-[var(--color-muted)] group-hover:text-[var(--color-paper)]/80"
	>
		{project.year}
	</span>
	<div class="col-span-12 md:col-span-7 order-4 md:order-2">
		<h2 class="font-serif {titleClass} leading-[0.95] tracking-tight">{project.title}</h2>
		<p
			class="mt-2 text-base text-[var(--color-muted)] group-hover:text-[var(--color-paper)]/80 max-w-[50ch]"
		>
			{project.subtitle}
		</p>
	</div>
</a>
