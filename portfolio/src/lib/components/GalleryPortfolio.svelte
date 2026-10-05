<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { galleryArtworks } from '$lib/gallery-artworks';
	import MuseumLabel from '$lib/components/MuseumLabel.svelte';
	import PaintingDepth from '$lib/components/PaintingDepth.svelte';
	const collection = [
		{ slug: 'cord', title: 'Cord', category: 'Research & product design', caption: 'A new perspective on career decisions.', artwork: galleryArtworks.cord },
		{ slug: 'indie-campers', title: 'Indie Campers', category: 'Product & creative direction', caption: 'Designing the freedom to explore.', artwork: galleryArtworks['indie-campers'] },
		{ slug: 'tenzo', title: 'Tenzo', category: 'Product & systems design', caption: 'Clarity behind every service.', artwork: galleryArtworks.tenzo }
	];
	let active = $state(0);
	let grid = $state(false);
	let reduced = false;
	let track: HTMLDivElement;
	let mounted = false;
	const number = (i: number) => String(i + 1).padStart(2, '0');
	function center(index: number, smooth = true) {
		active = index;
		const tile = track?.querySelectorAll<HTMLElement>('.project-tile')[index];
		if (tile && grid) tile.scrollIntoView({ block: 'center', behavior: smooth && !reduced ? 'smooth' : 'instant' });
		if (tile && !grid) { const bounds = tile.getBoundingClientRect(); window.scrollTo({ top: scrollY + bounds.top + bounds.height / 2 - innerHeight / 2, behavior: smooth && !reduced ? 'smooth' : 'instant' }); }
	}
	async function display(asGrid: boolean) {
		if (grid === asGrid) return;
		grid = asGrid;
		await tick();
		if (asGrid) window.scrollTo({ top: 0, behavior: 'instant' });
		else center(active, false);
	}
	onMount(() => {
		mounted = true;
		const media = matchMedia('(prefers-reduced-motion: reduce)');
		const preference = () => { reduced = media.matches; };
		preference();
		let frame = 0;
		const read = () => {
			frame = 0;
			if (grid && innerWidth > 760) return;
			let closest = Infinity;
			track.querySelectorAll<HTMLElement>('.project-tile').forEach((tile, i) => {
				const r = tile.getBoundingClientRect();
				const distance = Math.abs(r.top + r.height / 2 - innerHeight / 2);
				if (distance < closest) { closest = distance; active = i; }
			});
		};
		const scroll = () => { if (!frame) frame = requestAnimationFrame(read); };
		const resize = () => center(active, false);
		window.addEventListener('scroll', scroll, { passive: true });
		window.addEventListener('resize', resize);
		media.addEventListener('change', preference);
		read();
		return () => { mounted = false; cancelAnimationFrame(frame); window.removeEventListener('scroll', scroll); window.removeEventListener('resize', resize); media.removeEventListener('change', preference); };
	});
</script>

<div class="gallery" class:grid-mode={grid} data-project={collection[active].slug}>
	<div class="backdrops" aria-hidden="true">
		{#each collection as project, i}
			<div class="backdrop" class:visible={active === i} style:background-image={`url('${project.artwork.image}')`} style:--art-position={project.artwork.position} style:--art-mobile-position={project.artwork.mobilePosition}>
				{#if project.slug === 'cord'}<PaintingDepth src={project.artwork.image} active={active === i} />{/if}
			</div>
		{/each}
		<div class="veil"></div>
	</div>

	<header class="identity"><a href="/">Micaela Ribeiro</a><p>Product designer & digital curator</p></header>
	<nav class="gallery-index" aria-label="Selected projects">
		<h2>Selected work</h2>
		{#each collection as project, i}<button class:chosen={active === i} aria-current={active === i ? 'true' : undefined} onclick={() => center(i)}>{project.title}<span>{number(i)}</span></button>{/each}
	</nav>

	<div class="counter" aria-live="polite" aria-atomic="true"><span>{number(active)}</span><span class="divider">/</span><span>03</span></div>
	<div class="rule left" aria-hidden="true"></div><div class="rule right" aria-hidden="true"></div>
	<a class="about" href="/about">About <span>↗</span></a>

	<div bind:this={track} class="tile-track" aria-label="Project collection">
		{#each collection as project, i}
			<a class="project-tile" class:in-focus={active === i} href={`/work/${project.slug}`} aria-label={`Explore ${project.title} — ${project.category}`} onmouseenter={() => { if (grid) active = i; }} onfocus={() => { if (grid) active = i; else if (mounted) center(i, false); }}>
				<span class="placeholder-top"><span>{number(i)} — Selected work</span><span>↗</span></span>
				<span class="placeholder-center"><span class="cross" aria-hidden="true">+</span><span class="tile-title">{project.title}</span><span class="image-label">Project image to come</span></span>
				<span class="placeholder-bottom"><span>Image placeholder</span><span>1 : 1</span></span>
			</a>
		{/each}
	</div>

	<div class="project-caption" aria-live="polite" aria-atomic="true">
		{#key active}<div class="caption-content"><p class="category">{collection[active].category}</p><h1>{collection[active].title}</h1><p class="description">{collection[active].caption}</p><a href={`/work/${collection[active].slug}`}>View project <span>↗</span></a></div>{/key}
	</div>
	<div class="scroll-controls"><button disabled={active === 0} aria-label="Previous project" onclick={() => center(active - 1)}>↑</button><span>{grid ? 'Explore the collection' : 'Scroll to explore'}</span><button disabled={active === collection.length - 1} aria-label="Next project" onclick={() => center(active + 1)}>↓</button></div>
	<div class="display-mode"><h2>Display mode</h2><div><button aria-pressed={!grid} onclick={() => display(false)}>Slider</button><span>/</span><button aria-pressed={grid} onclick={() => display(true)}>Grid</button></div></div>
	{#key active}
		<MuseumLabel artwork={collection[active].artwork} company={collection[active].title} slug={collection[active].slug} />
	{/key}
</div>

<style>
	:global(.home-route:has(.gallery)){width:100%;max-width:none}
	.gallery{--tile:clamp(230px,25vw,360px);--edge:3vw;--ink:#f7f4ec;min-height:100svh;color:var(--ink);font-family:var(--font-sans);isolation:isolate;background:#211e17}
	.backdrops{position:fixed;inset:0;z-index:-1;overflow:hidden;background:#211e17;pointer-events:none}.backdrop{position:absolute;inset:-2%;background-size:cover;background-repeat:no-repeat;opacity:0;transform:scale(1.07);transition:opacity 1000ms ease,transform 1800ms cubic-bezier(.2,.65,.3,1);will-change:opacity,transform}.backdrop.visible{opacity:1;transform:scale(1)}.veil{position:absolute;inset:0;background:linear-gradient(90deg,#16171180,transparent 48%,#1617115e),linear-gradient(0deg,#12140fb8,transparent 42%,#17181038)}
	.identity,.gallery-index,.counter,.rule,.about,.project-caption,.display-mode,.scroll-controls{position:fixed;z-index:3}
	.identity{left:var(--edge);top:35px}.identity>a{font:italic 27px/1 'Instrument Serif',Georgia,serif}.identity p{font-size:9px;letter-spacing:.06em;margin:10px 0 0;opacity:.75}
	h2{font:italic 23px/1.2 'Instrument Serif',Georgia,serif;text-decoration:underline;text-underline-offset:5px;font-weight:400;margin:0 0 17px}
	.gallery-index{right:var(--edge);top:34px;text-align:right;min-width:170px}.gallery-index button{display:flex;width:100%;justify-content:flex-end;gap:16px;align-items:center;font-size:11px;letter-spacing:.025em;min-height:30px;opacity:.5;transition:opacity .25s;cursor:pointer}.gallery-index button.chosen,.gallery-index button:hover{opacity:1}.gallery-index button span{font-size:8px}
	.counter{left:var(--edge);top:50%;transform:translateY(-50%);display:flex;gap:12px;align-items:center;font:italic 43px/1 'Instrument Serif',Georgia,serif}.counter .divider{opacity:.5;font-size:34px}.counter span:last-child{opacity:.65}.rule{top:50%;height:1px;background:#f6f3e747;pointer-events:none}.rule.left{left:calc(var(--edge) + 155px);right:calc(50% + var(--tile)/2 + 45px)}.rule.right{left:calc(50% + var(--tile)/2 + 45px);right:calc(var(--edge) + 80px)}.about{right:var(--edge);top:50%;transform:translateY(-50%);font-size:11px;letter-spacing:.07em;text-transform:uppercase;padding-block:16px}.about span{margin-left:8px}
	.tile-track{width:var(--tile);margin:0 auto;display:flex;flex-direction:column;gap:74px;padding-block:calc(50svh - var(--tile)/2);position:relative;z-index:2}
	.project-tile{height:var(--tile);width:var(--tile);flex-shrink:0;position:relative;display:flex;flex-direction:column;justify-content:space-between;padding:18px;background:#e8e4d9;color:#373a33;opacity:.6;transform:scale(.92);transition:opacity .65s,transform .8s cubic-bezier(.2,.65,.3,1),background .4s;box-shadow:0 20px 70px #14160f18}.project-tile.in-focus{opacity:1;transform:scale(1);background:#f0ede5}.project-tile:hover{background:#faf8f1}.placeholder-top,.placeholder-bottom{display:flex;justify-content:space-between;font-size:8px;letter-spacing:.06em}.placeholder-top>span:last-child{font-size:14px;line-height:1}.placeholder-bottom{opacity:.48;font-size:7px;text-transform:uppercase}.placeholder-center{display:flex;align-items:center;flex-direction:column;gap:11px}.cross{font:200 27px/1 var(--font-sans);opacity:.3}.tile-title{font:italic clamp(28px,3vw,43px)/1.1 'Instrument Serif',Georgia,serif;letter-spacing:-.025em}.image-label{font-size:8px;letter-spacing:.08em;opacity:.55}
	.project-caption{left:var(--edge);bottom:48px;max-width:29vw}.category{font-size:8px;text-transform:uppercase;letter-spacing:.12em;margin:0 0 15px;opacity:.7}.project-caption h1{font:400 clamp(34px,4vw,64px)/1 'Instrument Serif',Georgia,serif;letter-spacing:-.025em;margin:0 0 12px}.description{font-size:11px;line-height:1.5;margin:0 0 15px;opacity:.85}.project-caption a{font-size:9px;text-transform:uppercase;letter-spacing:.07em;padding-block:10px;display:inline-block}.project-caption a span{margin-left:22px}.caption-content{animation:arrive .6s both}@keyframes arrive{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
	.display-mode{bottom:42px;right:var(--edge);text-align:right}.display-mode>div{display:flex;justify-content:flex-end;align-items:center;gap:10px;font-size:11px}.display-mode button{opacity:.5;min-height:34px;cursor:pointer}.display-mode button[aria-pressed='true']{opacity:1}.display-mode>div>span{opacity:.4}.scroll-controls{left:50%;bottom:30px;transform:translateX(-50%);display:flex;align-items:center;gap:12px;font-size:8px;letter-spacing:.08em;white-space:nowrap;background:#1c1f185e;backdrop-filter:blur(12px);padding:0 6px}.scroll-controls button{width:34px;height:38px;font-size:16px;cursor:pointer}.scroll-controls button:disabled{opacity:.2;cursor:default}
	.gallery :is(a,button):focus-visible{outline:2px solid currentColor;outline-offset:6px}
	.grid-mode .tile-track{width:min(66vw,1100px);min-height:100svh;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px;align-content:center;padding:160px 0 230px}.grid-mode .project-tile{width:100%;height:auto;aspect-ratio:1}.grid-mode .rule{display:none}.grid-mode .counter{top:31%}.grid-mode .scroll-controls{display:none}.grid-mode .tile-title{font-size:clamp(24px,2.8vw,40px)}
	@media(max-width:760px){.gallery{--tile:min(58vw,290px);--edge:6vw}.identity{top:25px}.identity>a{font-size:23px}.identity p{max-width:125px;line-height:1.5;font-size:8px}.gallery-index{top:25px;min-width:110px}.gallery-index h2{font-size:20px;margin-bottom:10px}.gallery-index button{font-size:9px;min-height:28px;gap:9px}.gallery-index button span{font-size:7px}.tile-track{gap:50px}.project-tile{padding:14px}.tile-title{font-size:30px}.counter{top:calc(50% - var(--tile)/2 - 35px);font-size:27px;gap:8px}.counter .divider{font-size:23px}.rule{display:none}.about{top:auto;bottom:169px;transform:none;font-size:9px}.project-caption{bottom:92px;max-width:73vw}.project-caption h1{font-size:36px;margin-bottom:9px}.category{font-size:7px;letter-spacing:.08em;margin-bottom:10px}.description{font-size:10px;max-width:250px;margin-bottom:5px}.project-caption a{font-size:8px}.display-mode{bottom:20px}.display-mode h2{display:none}.display-mode>div{font-size:10px}.scroll-controls{bottom:18px;left:var(--edge);transform:none;gap:6px;background:transparent;backdrop-filter:none;padding:0}.scroll-controls span{font-size:7px}.scroll-controls button{width:28px}.grid-mode .tile-track{width:70vw;grid-template-columns:1fr;gap:24px;padding:190px 0 280px}.grid-mode .project-tile{aspect-ratio:1.2}.grid-mode .counter{top:140px}.grid-mode .about{bottom:45px}.grid-mode .project-caption{background:#1c201be8;left:0;bottom:65px;padding:14px 6vw;width:100%;max-width:none;pointer-events:none}.grid-mode .project-caption a{pointer-events:auto}.grid-mode .project-caption h1{font-size:27px}.grid-mode .project-caption .description{display:none}.grid-mode .category{margin-bottom:7px}}
	@media(max-height:650px) and (max-width:760px){.gallery{--tile:180px}.project-caption{bottom:64px}.project-caption h1{font-size:28px}.description{display:none}.about{bottom:106px}.category{margin-bottom:6px}.gallery-index button{min-height:23px}.identity p{display:none}.tile-title{font-size:26px}.counter{font-size:23px}}
	@media(max-width:760px){.gallery:not(.grid-mode) .project-tile:not(.in-focus){opacity:0;pointer-events:none}.veil{background:linear-gradient(90deg,#16171180,transparent 75%),linear-gradient(0deg,#12140fdb,transparent 48%,#17181088)}.grid-mode .gallery-index{background:#171b16dc;padding:10px;top:15px;right:calc(var(--edge) - 10px)}}
	.backdrop{background-position:var(--art-position)}
	@media(max-width:760px){.backdrop{background-position:var(--art-mobile-position)}.project-caption{bottom:155px}.about{top:145px;bottom:auto}.grid-mode .project-caption{bottom:145px}.grid-mode .about{top:145px;bottom:auto}.grid-mode .tile-track{padding-bottom:360px}}
	@media(max-height:650px) and (max-width:760px){.gallery{--tile:150px}.project-caption{bottom:135px}.project-caption .category{display:none}.project-caption h1{font-size:26px}.about{top:125px}.grid-mode .about{top:125px}}
	@media(prefers-reduced-motion:reduce){.backdrop,.project-tile{transition:none;transform:none}.caption-content{animation:none}}
</style>
