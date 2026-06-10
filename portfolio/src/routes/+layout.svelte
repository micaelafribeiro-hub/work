<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';
	import { page } from '$app/state';

	let { children } = $props();

	const nav = [
		{ href: '/work', label: 'Work' },
		{ href: '/about', label: 'About' }
	];
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<a href="#main" class="skip-link focus:skip-link-focus">Skip to content</a>

<div class="min-h-screen flex flex-col mx-auto max-w-[var(--container-content)]">
	<header
		class="px-5 sm:px-6 md:px-12 pt-6 sm:pt-8 pb-4 sm:pb-6 flex flex-wrap items-baseline justify-between gap-y-3 gap-x-6"
	>
		<a href="/" class="eyebrow inline-flex items-center min-h-[2.75rem] py-2">
			<span aria-hidden="true">Micaela</span>
			<span class="hidden sm:inline" aria-hidden="true">&nbsp;·&nbsp;Index</span>
			<span class="sr-only">Micaela, Home</span>
		</a>
		<nav aria-label="Primary" class="flex gap-5 sm:gap-8 eyebrow">
			{#each nav as item}
				{@const active = page.url.pathname === item.href || page.url.pathname.startsWith(item.href + '/')}
				<a
					href={item.href}
					aria-current={active ? 'page' : undefined}
					class="inline-flex items-center min-h-[2.75rem] py-2 underline-offset-[6px] decoration-1 {active
						? 'underline'
						: 'hover:underline focus-visible:underline'}"
				>
					{item.label}
				</a>
			{/each}
		</nav>
	</header>

	<main id="main" class="flex-1">
		{@render children()}
	</main>

	<footer
		class="px-5 sm:px-6 md:px-12 py-8 mt-16 sm:mt-24 rule flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 eyebrow"
	>
		<span>© {new Date().getFullYear()} Micaela</span>
		<span class="text-[var(--color-muted)]">Lisbon</span>
	</footer>
</div>
