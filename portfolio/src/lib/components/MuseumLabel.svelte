<script lang="ts">
	import type { galleryArtworks } from '$lib/gallery-artworks';
	let { artwork, company, slug }: { artwork: (typeof galleryArtworks)[keyof typeof galleryArtworks]; company: string; slug: string } = $props();
	let element: HTMLDivElement;
	let hovered = $state(false);
	let focused = $state(false);
	let pinned = $state(false);
	let dismissed = $state(false);
	const open = $derived(!dismissed && (hovered || focused || pinned));
	const panelId = $derived(`painting-connection-${slug}`);
	function close() { pinned = false; dismissed = true; }
</script>

<svelte:window onkeydown={(event) => { if (event.key === 'Escape' && open) close(); }} onpointerdown={(event) => { if (element && !element.contains(event.target as Node)) close(); }} />

<div
	bind:this={element}
	class="museum-label"
	role="group"
	aria-label={`Background artwork for ${company}`}
	onpointerenter={(event) => { if (event.pointerType === 'mouse') { hovered = true; dismissed = false; } }}
	onpointerleave={() => { hovered = false; }}
	onfocusin={() => { focused = true; dismissed = false; }}
	onfocusout={(event) => { if (!element.contains(event.relatedTarget as Node | null)) { focused = false; pinned = false; } }}
>
	<button class="museum-plaque" aria-expanded={open} aria-controls={panelId} onclick={() => { pinned = !pinned; dismissed = !pinned; }}>
		<span class="painting-title">{artwork.title}</span>
		<span class="painting-meta">{artwork.artist}<span class="dot" aria-hidden="true">·</span>{artwork.year}</span>
		<span class="pairing-hint">Curator’s note<span aria-hidden="true">{open ? '−' : '+'}</span></span>
	</button>
	<div class="connection-wrap" hidden={!open}>
		<section class="connection-panel" id={panelId} aria-labelledby={`${panelId}-title`}>
			<h2 id={`${panelId}-title`}>Why {company}?</h2>
			<p class="curator-note">{artwork.connection}</p>
			<p class="collection">{artwork.collection}</p>
			<details class="source-details">
				<summary>Artwork source & credits</summary>
				<p>{artwork.credit} <a href={artwork.licenseUrl} target="_blank" rel="noreferrer">{artwork.license}</a></p>
				<p>{artwork.changes}</p>
				<a href={artwork.source} target="_blank" rel="noreferrer">View the original ↗</a>
			</details>
		</section>
	</div>
</div>

<style>
	.museum-label{position:fixed;right:var(--edge);bottom:42px;z-index:6;color:var(--ink,#f7f4ec);font-family:var(--font-sans)}
	/* Plain text in the page's own voice: serif title, small sans details. */
	.museum-plaque{display:block;text-align:right;padding-block:4px;cursor:pointer}
	.painting-title{display:block;font:600 16px/1.2 var(--font-sans);letter-spacing:-.01em}.painting-meta{display:flex;justify-content:flex-end;flex-wrap:wrap;gap:0 7px;font-size:10px;line-height:1.5;margin-top:5px;opacity:.75}.dot{opacity:.5}.pairing-hint{display:flex;justify-content:flex-end;align-items:center;gap:10px;margin-top:9px;font-size:9px;letter-spacing:.07em;text-transform:uppercase;opacity:.85;transition:opacity .25s}.museum-plaque:hover .pairing-hint{opacity:1}.pairing-hint>span{font-size:12px;line-height:1}
	.connection-wrap{position:absolute;bottom:100%;right:0;width:300px;padding-bottom:10px;max-width:88vw}.connection-wrap[hidden]{display:none}.connection-panel{background:#f3f0e8;color:#292a26;padding:22px;box-shadow:0 8px 35px #0002;max-height:55svh;overflow:auto}.connection-panel h2{font:600 20px/1.15 var(--font-sans);letter-spacing:-.02em;margin:0 0 13px}.curator-note{font-size:12px;line-height:1.7;margin:0 0 16px}.collection{font-size:9px;line-height:1.5;margin:0;padding-top:12px;border-top:1px solid #292a2620;color:#63645b}.source-details{margin-top:10px;font-size:9px;line-height:1.6}.source-details summary{cursor:pointer;padding:5px 0}.source-details p{margin:10px 0}.source-details a{text-decoration:underline;text-underline-offset:3px}.museum-plaque:focus-visible{outline:2px solid currentColor;outline-offset:6px}.connection-panel :is(a,summary):focus-visible{outline:2px solid #515d4a;outline-offset:4px}
	@media(max-width:1000px) and (min-width:761px){.painting-title{font-size:15px}}
	@media(max-width:760px){.museum-label{right:var(--edge);bottom:20px;max-width:calc(100vw - 2 * var(--edge) - 145px)}.painting-title{font-size:14px}.painting-meta{font-size:8px;margin-top:3px}.pairing-hint{font-size:0;gap:0;margin-top:4px}.pairing-hint>span{font-size:14px}.connection-wrap{width:calc(100vw - 2 * var(--edge));max-width:none}.connection-panel{max-height:55svh;padding:19px}.connection-panel h2{font-size:19px}}
	@media(prefers-reduced-motion:reduce){.pairing-hint{transition:none}}
</style>
