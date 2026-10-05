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
		<span class="pairing-hint">The connection to {company}<span aria-hidden="true">{open ? '−' : '+'}</span></span>
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
	.museum-label{position:fixed;right:var(--edge);bottom:155px;z-index:6;width:245px;color:#292a26;font-family:var(--font-sans)}
	.museum-plaque{display:block;width:100%;text-align:left;background:#f3f0e8f5;padding:17px 19px 13px;border-left:2px solid #b6ac90;box-shadow:0 6px 26px #00000012;cursor:pointer;transition:background .2s}
	.museum-plaque:hover{background:#faf8f2}.painting-title{display:block;font:italic 20px/1.12 'Instrument Serif',Georgia,serif;letter-spacing:-.015em}.painting-meta{display:flex;flex-wrap:wrap;gap:0 7px;font-size:10px;line-height:1.5;margin-top:8px}.dot{opacity:.4}.pairing-hint{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-top:12px;padding-top:9px;border-top:1px solid #292a2620;font-size:8px;letter-spacing:.02em;color:#606155}.pairing-hint>span{font-size:13px;line-height:1}
	.connection-wrap{position:absolute;bottom:100%;right:0;width:300px;padding-bottom:10px;max-width:88vw}.connection-wrap[hidden]{display:none}.connection-panel{background:#f3f0e8;color:#292a26;padding:22px;box-shadow:0 8px 35px #0002;max-height:55svh;overflow:auto}.connection-panel h2{font:italic 25px/1.1 'Instrument Serif',Georgia,serif;font-weight:400;letter-spacing:-.02em;margin:0 0 13px}.curator-note{font-size:12px;line-height:1.7;margin:0 0 16px}.collection{font-size:9px;line-height:1.5;margin:0;padding-top:12px;border-top:1px solid #292a2620;color:#63645b}.source-details{margin-top:10px;font-size:9px;line-height:1.6}.source-details summary{cursor:pointer;padding:5px 0}.source-details p{margin:10px 0}.source-details a{text-decoration:underline;text-underline-offset:3px}.museum-label :is(button,a,summary):focus-visible{outline:2px solid #515d4a;outline-offset:4px}
	@media(max-width:1000px) and (min-width:761px){.museum-label{width:205px}.painting-title{font-size:19px}}
	@media(max-width:760px){.museum-label{left:var(--edge);right:var(--edge);bottom:65px;width:auto}.museum-plaque{padding:11px 14px 10px;position:relative}.painting-title{font-size:18px;padding-right:18px}.painting-meta{font-size:9px;margin-top:5px}.pairing-hint{position:absolute;right:13px;top:50%;transform:translateY(-50%);margin:0;padding:0;border:0;font-size:0;gap:0}.pairing-hint>span{font-size:18px}.connection-wrap{width:100%;max-width:none}.connection-panel{max-height:55svh;padding:19px}.connection-panel h2{font-size:24px}}
	@media(prefers-reduced-motion:reduce){.museum-plaque{transition:none}}
</style>
