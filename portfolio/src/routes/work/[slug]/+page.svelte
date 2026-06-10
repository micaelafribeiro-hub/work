<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const project = $derived(data.project);
	const prev = $derived(data.prev);
	const next = $derived(data.next);
</script>

<svelte:head>
	<title>{project.title} · Micaela</title>
	<meta name="description" content={project.hook ?? project.subtitle} />
</svelte:head>

<article>
	<header
		class="px-5 sm:px-6 md:px-12 pt-10 sm:pt-16 md:pt-24 pb-12 sm:pb-16 grid grid-cols-12 gap-x-4 sm:gap-x-6 gap-y-6"
	>
		<p class="eyebrow col-span-12 md:col-span-3">
			Case {project.no} · {project.yearRange}
		</p>
		<h1 class="display-xl col-span-12 md:col-span-9">
			{project.title}
		</h1>
		<p
			class="col-span-12 md:col-span-9 md:col-start-4 mt-4 sm:mt-8 font-serif text-2xl md:text-3xl leading-[1.2] max-w-[32ch]"
		>
			{project.subtitle}.
		</p>
		{#if project.hook}
			<p
				class="col-span-12 md:col-span-9 md:col-start-4 text-lg leading-[1.6] text-[var(--color-muted)] max-w-[60ch]"
			>
				{project.hook}
			</p>
		{/if}
	</header>

	{#if project.heroImage}
		<section class="px-5 sm:px-6 md:px-12 pb-12 sm:pb-16">
			<figure class="img-placeholder" data-ratio={project.heroImage.ratio}>
				<div class="img-placeholder__frame">
					<span class="eyebrow text-[var(--color-muted)]">Image · {project.heroImage.ratio}</span>
					<p class="mt-3 font-serif italic text-lg leading-[1.4] max-w-[48ch] mx-auto">
						{project.heroImage.description}
					</p>
				</div>
				{#if project.heroImage.caption}
					<figcaption class="img-placeholder__caption">
						{project.heroImage.caption}
					</figcaption>
				{/if}
			</figure>
		</section>
	{/if}

	<section
		class="px-5 sm:px-6 md:px-12 py-10 sm:py-12 rule grid grid-cols-12 gap-x-4 sm:gap-x-6 gap-y-6"
	>
		<dl class="col-span-12 md:col-span-9 md:col-start-4 meta-grid">
			{#each project.meta as field}
				<div>
					<dt class="eyebrow text-[var(--color-muted)]">{field.label}</dt>
					<dd class="mt-2 text-base leading-[1.4]">
						{#if field.href}
							<a
								href={field.href}
								target="_blank"
								rel="noopener noreferrer"
								class="underline underline-offset-[4px] decoration-1 hover:italic focus-visible:italic"
							>
								{field.value}
							</a>
						{:else}
							{field.value}
						{/if}
					</dd>
				</div>
			{/each}
		</dl>
	</section>

	{#each project.sections as section, i}
		<section
			class="px-5 sm:px-6 md:px-12 py-16 sm:py-24 {i > 0
				? 'rule'
				: ''} grid grid-cols-12 gap-x-4 sm:gap-x-6 gap-y-6"
		>
			<h2 class="eyebrow col-span-12 md:col-span-3 self-start text-[var(--color-muted)]">
				{section.eyebrow}
			</h2>

			<div class="col-span-12 md:col-span-9 flex flex-col gap-10 sm:gap-12">
				<h3 class="font-serif text-3xl md:text-4xl leading-[1.05] tracking-tight max-w-[28ch]">
					{section.heading}
				</h3>

				{#if section.body}
					<p class="text-lg leading-[1.65] max-w-[60ch]">{section.body}</p>
				{/if}

				{#if section.images}
					{@const isGallery = section.images.length > 1}
					<div class={isGallery ? 'img-gallery' : ''} data-count={section.images.length}>
						{#each section.images as image}
							<figure class="img-placeholder" data-ratio={image.ratio}>
								<div class="img-placeholder__frame">
									<span class="eyebrow text-[var(--color-muted)]">
										{isGallery ? image.ratio : `Image · ${image.ratio}`}
									</span>
									<p
										class="mt-3 font-serif italic leading-[1.4] mx-auto {isGallery
											? 'max-w-[28ch]'
											: 'text-lg max-w-[44ch]'}"
									>
										{image.description}
									</p>
								</div>
								{#if image.caption}
									<figcaption class="img-placeholder__caption">{image.caption}</figcaption>
								{/if}
							</figure>
						{/each}
					</div>
				{/if}

				{#if section.stats}
					<dl class="stats-grid" data-count={section.stats.length}>
						{#each section.stats as stat}
							<div class="min-w-0">
								<dt
									class="font-serif text-2xl md:text-3xl leading-[0.95] tracking-tight"
								>
									{stat.value}
								</dt>
								<dd class="mt-3 eyebrow text-[var(--color-muted)] max-w-[16ch]">
									{stat.label}
								</dd>
							</div>
						{/each}
					</dl>
				{/if}

				{#if section.items}
					<dl class="items-grid" data-count={section.items.length}>
						{#each section.items as item}
							<div class="min-w-0">
								<dt class="font-serif text-xl leading-[1.2]">{item.title}</dt>
								<dd class="mt-2 text-[var(--color-muted)] leading-[1.55] max-w-[36ch]">
									{item.body}
								</dd>
							</div>
						{/each}
					</dl>
				{/if}

				{#if section.callout}
					<aside class="border-l border-[var(--color-rule)] pl-5 sm:pl-6 max-w-[60ch]">
						<p class="eyebrow text-[var(--color-muted)]">{section.callout.label}</p>
						<p class="mt-3 font-serif italic text-lg leading-[1.6]">
							{section.callout.body}
						</p>
					</aside>
				{/if}

				{#if section.reflection}
					<aside
						class="bg-[var(--color-ink)]/[0.04] border-l-2 border-[var(--color-muted)] pl-5 sm:pl-6 pr-5 sm:pr-6 py-5 sm:py-6 max-w-[60ch]"
					>
						<p class="eyebrow text-[var(--color-muted)]">{section.reflection.label}</p>
						<p class="mt-3 italic leading-[1.6] text-[var(--color-muted)]">
							{section.reflection.body}
						</p>
					</aside>
				{/if}
			</div>
		</section>
	{/each}

	{#if project.quote}
		<section
			class="px-5 sm:px-6 md:px-12 py-20 sm:py-32 rule grid grid-cols-12 gap-x-4 sm:gap-x-6"
		>
			<blockquote
				class="col-span-12 md:col-span-10 md:col-start-2 font-serif italic text-3xl md:text-5xl leading-[1.1] tracking-tight max-w-[20ch] mx-auto text-center"
			>
				&ldquo;{project.quote}&rdquo;
			</blockquote>
		</section>
	{/if}

	<nav
		class="px-5 sm:px-6 md:px-12 py-10 sm:py-16 rule grid grid-cols-12 gap-x-4 sm:gap-x-6 gap-y-4 eyebrow"
		aria-label="Case study navigation"
	>
		<a
			href="/work"
			class="col-span-12 sm:col-span-4 underline underline-offset-[6px] decoration-1 inline-flex items-center min-h-[2.5rem] py-1"
		>
			← All projects
		</a>
		{#if prev}
			<a
				href={`/work/${prev.slug}`}
				class="col-span-6 sm:col-span-4 sm:text-center underline underline-offset-[6px] decoration-1 inline-flex items-center min-h-[2.5rem] py-1 sm:justify-center"
			>
				← {prev.title}
			</a>
		{:else}
			<span class="col-span-6 sm:col-span-4"></span>
		{/if}
		{#if next}
			<a
				href={`/work/${next.slug}`}
				class="col-span-6 sm:col-span-4 text-right underline underline-offset-[6px] decoration-1 inline-flex items-center justify-end min-h-[2.5rem] py-1"
			>
				{next.title} →
			</a>
		{:else}
			<span class="col-span-6 sm:col-span-4"></span>
		{/if}
	</nav>
</article>
