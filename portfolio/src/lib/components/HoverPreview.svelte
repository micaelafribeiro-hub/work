<script lang="ts">
	import type { CaseImage } from '$lib/projects';

	let {
		image,
		title,
		x,
		y
	}: {
		image: CaseImage | null | undefined;
		title?: string;
		x: number;
		y: number;
	} = $props();
</script>

{#if image}
	<figure
		class="hover-preview"
		data-ratio={image.ratio}
		style="--x: {x}px; --y: {y}px"
		aria-hidden="true"
	>
		{#if image.src}
			<img src={image.src} alt="" />
		{:else}
			<div class="placeholder">
				{#if title}
					<span class="title">{title}</span>
				{/if}
				<span class="ratio">{image.ratio}</span>
			</div>
		{/if}
	</figure>
{/if}

<style>
	.hover-preview {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 50;
		pointer-events: none;
		width: 22rem;
		margin: 0;
		transform: translate3d(calc(var(--x) + 1.5rem), calc(var(--y) - 50%), 0);
		transition: transform 0.08s ease-out;
		will-change: transform;
	}

	.hover-preview[data-ratio='21:9'] { aspect-ratio: 21 / 9; }
	.hover-preview[data-ratio='16:9'] { aspect-ratio: 16 / 9; }
	.hover-preview[data-ratio='3:2']  { aspect-ratio: 3 / 2; }
	.hover-preview[data-ratio='4:3']  { aspect-ratio: 4 / 3; }
	.hover-preview[data-ratio='1:1']  { aspect-ratio: 1 / 1; }
	.hover-preview[data-ratio='3:4']  { aspect-ratio: 3 / 4; }
	.hover-preview[data-ratio='9:16'] { aspect-ratio: 9 / 16; }

	.hover-preview img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.placeholder {
		width: 100%;
		height: 100%;
		background: var(--color-paper);
		border: 1px dashed var(--color-rule);
		padding: 1.25rem;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.title {
		font-family: var(--font-serif);
		font-size: 1.75rem;
		line-height: 1;
		letter-spacing: -0.02em;
	}

	.ratio {
		font-family: var(--font-sans);
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.18em;
		color: var(--color-muted);
		align-self: flex-end;
	}

	/* No hover preview on touch devices or when reduced motion is preferred. */
	@media (hover: none), (prefers-reduced-motion: reduce) {
		.hover-preview {
			display: none;
		}
	}
</style>
