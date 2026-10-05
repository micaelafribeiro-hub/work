<script lang="ts">
	import type { PageData } from './$types';
	import MuseumLabel from '$lib/components/MuseumLabel.svelte';
	import PaintingDepth from '$lib/components/PaintingDepth.svelte';
	import { galleryDepth } from '$lib/gallery-depth';
	import { collection, pieceNumber, transitionNames } from '$lib/gallery-collection';
	import { galleryState } from '$lib/gallery-state.svelte';

	let { data }: { data: PageData } = $props();
	const project = $derived(data.project);
	const index = $derived(collection.findIndex((item) => item.slug === project.slug));
	const piece = $derived(collection[index]);
	const next = $derived(collection[(index + 1) % collection.length]);
	const names = $derived(transitionNames(project.slug));
	const nextNames = $derived(transitionNames(next.slug));
	const [intro, ...rooms] = $derived(project.sections);
	const live = $derived(project.meta.find((field) => field.href));

	// Returning to the gallery lands on this painting.
	$effect(() => { galleryState.active = index; });

	const ratio = (value: string) => value.replace(':', ' / ');
</script>

<svelte:head>
	<title>{project.title} · Micaela Ribeiro</title>
	<meta name="description" content={project.hook ?? project.subtitle} />
</svelte:head>

<article class="exhibit">
	<div class="painting" aria-hidden="true" style:view-transition-name={names.art} style:background-image={`url('${piece.artwork.image}')`} style:--art-position={piece.artwork.position} style:--art-mobile-position={piece.artwork.mobilePosition}>
		<PaintingDepth src={piece.artwork.image} config={galleryDepth[project.slug]} index={index} active={true} />
		<div class="veil"></div>
	</div>

	<a class="back" href="/" aria-label="Back to the gallery"><span aria-hidden="true">←</span>Gallery<span class="back-index">{pieceNumber(index)} / {pieceNumber(collection.length - 1)}</span></a>

	<header class="hero">
		<div class="identity"><a href="/">Micaela Ribeiro</a><p>Product designer</p></div>
		<a class="status" href="mailto:micaela.f.ribeiro@gmail.com" aria-label="Open to talk — email Micaela"><span class="status-dot" aria-hidden="true"></span>Open to talk<span class="status-arrow" aria-hidden="true">↗</span></a>

		<figure class="frame hero-frame" style:view-transition-name={names.frame} aria-label={project.heroImage?.description ?? `${project.title} hero image`}>
			<span class="placeholder-top"><span>{pieceNumber(index)} — {project.subtitle}</span><span>{project.heroImage?.ratio ?? '1:1'}</span></span>
			<span class="placeholder-center"><span class="cross" aria-hidden="true">+</span><span class="frame-title">{project.title}</span><span class="image-label">Project image to come</span></span>
			<span class="placeholder-bottom"><span>Image placeholder</span><span>{project.yearRange}</span></span>
		</figure>

		<div class="hero-copy">
			<p class="category">{piece.category} · {project.yearRange}</p>
			<h1 style:view-transition-name={names.title}>{project.title}</h1>
			<p class="description">{piece.caption}</p>
		</div>

		<div class="hero-label"><MuseumLabel artwork={piece.artwork} company={project.title} slug={project.slug} /></div>
		<a class="enter" href="#statement">Scroll to enter <span aria-hidden="true">↓</span></a>
	</header>

	<div class="rooms">
		<section id="statement" class="room statement">
			<p class="room-label"><span>01</span>{intro?.eyebrow ?? 'Statement'}</p>
			<h2 class="lead">{project.hook ?? intro?.heading}</h2>
			<div class="statement-body">
				{#if intro?.body}<p>{intro.body}</p>{/if}
				<dl class="wall-label">
					{#each project.meta as field}
						<div><dt>{field.label}</dt><dd>{#if field.href}<a href={field.href} target="_blank" rel="noopener noreferrer">{field.value} ↗</a>{:else}{field.value}{/if}</dd></div>
					{/each}
				</dl>
			</div>
			{#if intro?.stats}<dl class="stats">{#each intro.stats as stat}<div><dt>{stat.value}</dt><dd>{stat.label}</dd></div>{/each}</dl>{/if}
			{#if intro?.callout}<aside class="note"><span>{intro.callout.label}</span><p>{intro.callout.body}</p></aside>{/if}
		</section>

		{#each rooms as room, i}
			<section class="room">
				<p class="room-label"><span>{pieceNumber(i + 1)}</span>{room.eyebrow}</p>
				<h2>{room.heading}</h2>
				{#if room.body}<p class="room-body">{room.body}</p>{/if}
				{#if room.images}
					{#each room.images as image, imageIndex}
						<figure class="artifact">
							<div class="frame artifact-frame" style:aspect-ratio={ratio(image.ratio)} aria-label={image.description}>
								<span class="placeholder-top"><span>Artifact {pieceNumber(i + 1)}.{imageIndex + 1}</span><span>{image.ratio}</span></span>
								<span class="placeholder-center"><span class="cross" aria-hidden="true">+</span><span class="image-label">Image to come</span></span>
								<span class="placeholder-bottom"><span>{project.title}</span><span>{room.eyebrow}</span></span>
							</div>
							{#if image.caption}<figcaption>{image.caption}</figcaption>{/if}
						</figure>
					{/each}
				{/if}
				{#if room.stats}<dl class="stats">{#each room.stats as stat}<div><dt>{stat.value}</dt><dd>{stat.label}</dd></div>{/each}</dl>{/if}
				{#if room.items}
					<div class="items">
						{#each room.items as item, itemIndex}<article><span>{pieceNumber(itemIndex)}</span><h3>{item.title}</h3><p>{item.body}</p></article>{/each}
					</div>
				{/if}
				{#if room.callout}<aside class="note"><span>{room.callout.label}</span><p>{room.callout.body}</p></aside>{/if}
				{#if room.reflection}<aside class="note reflection"><span>{room.reflection.label}</span><p>{room.reflection.body}</p></aside>{/if}
			</section>
		{/each}

		{#if project.quote}
			<section class="room closing"><p class="room-label"><span>—</span>What remains</p><blockquote>“{project.quote}”</blockquote></section>
		{/if}
		{#if live}<a class="pill live" href={live.href} target="_blank" rel="noopener noreferrer">Visit {live.value} <span aria-hidden="true">↗</span></a>{/if}
	</div>

	<a class="next" href={`/work/${next.slug}`} aria-label={`Next exhibition: ${next.title}`}>
		<span class="next-painting" aria-hidden="true" style:view-transition-name={nextNames.art} style:background-image={`url('${next.artwork.image}')`} style:--art-position={next.artwork.position}></span>
		<span class="next-copy"><span class="category">Next exhibition · {pieceNumber(collection.indexOf(next))}</span><strong>{next.title}</strong><span class="description">{next.caption}</span></span>
		<span class="frame next-frame" style:view-transition-name={nextNames.frame} aria-hidden="true"><span class="placeholder-center"><span class="cross">+</span><span class="frame-title">{next.title}</span></span></span>
		<span class="pill next-pill">Enter <span aria-hidden="true">→</span></span>
	</a>
</article>

<style>
	:global(.case-route:has(.exhibit)){width:100%;max-width:none}
	.exhibit{--edge:3vw;--ink:#f7f4ec;--wall:#17160f;position:relative;color:var(--ink);font-family:var(--font-sans);background:var(--wall);isolation:isolate}

	/* The painting stays fixed behind the whole visit, like the gallery. */
	.painting{position:fixed;inset:-2%;z-index:-1;background-size:cover;background-repeat:no-repeat;background-position:var(--art-position);pointer-events:none}
	.veil{position:absolute;inset:0;background:linear-gradient(90deg,#16171180,transparent 48%,#1617115e),linear-gradient(0deg,#12140fb8,transparent 42%,#17181038)}

	/* Chrome shared with the gallery: identity, status pill, translucent pills. */
	.identity{position:absolute;left:var(--edge);top:35px}.identity>a{font:600 22px/1 var(--font-sans);letter-spacing:-.02em}.identity p{font-size:9px;letter-spacing:.06em;margin:10px 0 0;opacity:.75}
	.status,.back,.pill,.enter{display:inline-flex;align-items:center;gap:10px;height:38px;padding:0 16px;border-radius:999px;background:#1c1f185e;backdrop-filter:blur(12px);font-size:11px;letter-spacing:.02em;white-space:nowrap;transition:background .25s}
	.status:hover,.back:hover,.pill:hover,.enter:hover{background:#1c1f1899}
	.status{position:absolute;left:50%;top:31px;transform:translateX(-50%);padding-left:14px}.status-dot{width:7px;height:7px;border-radius:50%;background:#5fd38d;animation:status-pulse 2.4s ease-out infinite}.status-arrow{font-size:12px;transition:transform .25s}.status:hover .status-arrow{transform:translate(2px,-2px)}
	@keyframes status-pulse{0%{box-shadow:0 0 0 0 #5fd38d80}70%{box-shadow:0 0 0 7px #5fd38d00}100%{box-shadow:0 0 0 0 #5fd38d00}}
	.back{position:fixed;z-index:5;right:var(--edge);top:31px}.back-index{opacity:.55;font-size:9px;margin-left:4px}

	/* Hero: the framed piece on the painting, title bottom-left as on the gallery. */
	.hero{position:relative;min-height:100svh;display:grid;place-items:center}
	.frame{--size:clamp(260px,30vw,430px);--fw:calc(var(--size) * .025);--mat:calc(var(--size) * .1);position:relative;display:flex;flex-direction:column;justify-content:space-between;margin:0;color:#373a33;background:#f0ede5;border:var(--fw) solid;border-image:linear-gradient(160deg,#2b2b2b,#111 45%,#1d1d1d) 1;padding:calc(var(--mat) + 12px);box-shadow:inset 0 3px 6px -2px #0008,inset 0 0 0 var(--mat) #f8f6f0,inset 0 0 0 calc(var(--mat) + 1.5px) #00000026,0 2px 3px #0006,0 16px 24px -6px #0000008c,0 42px 70px -18px #00000080}
	.frame::after{content:'';position:absolute;inset:calc(var(--fw) * -1);pointer-events:none;box-shadow:inset 1px 1px 0 #ffffff4d,inset -1px -1px 0 #0000006b,inset 0 0 0 1px #0003}
	.hero-frame{width:var(--size);aspect-ratio:1}
	.placeholder-top,.placeholder-bottom{display:flex;justify-content:space-between;gap:12px;font-size:8px;letter-spacing:.06em}.placeholder-bottom{opacity:.48;font-size:7px;text-transform:uppercase}.placeholder-center{display:flex;align-items:center;flex-direction:column;gap:11px;text-align:center}.cross{font:200 27px/1 var(--font-sans);opacity:.3}.frame-title{font:600 clamp(24px,2.6vw,38px)/1.1 var(--font-sans);letter-spacing:-.03em}.image-label{font-size:8px;letter-spacing:.08em;opacity:.55}
	.hero-copy{position:absolute;left:var(--edge);bottom:48px;max-width:30vw}
	.category{font-size:8px;text-transform:uppercase;letter-spacing:.12em;margin:0 0 15px;opacity:.7}
	h1{font:600 clamp(30px,3.4vw,54px)/1 var(--font-sans);letter-spacing:-.035em;margin:0 0 12px;color:var(--ink)}
	.description{font-size:11px;line-height:1.5;margin:0;opacity:.85}
	.enter{position:absolute;left:50%;bottom:30px;transform:translateX(-50%);font-size:9px;letter-spacing:.08em}
	.enter span{animation:nudge 1.8s ease-in-out infinite}@keyframes nudge{50%{transform:translateY(3px)}}
	.hero-label :global(.museum-label){position:absolute}

	/* Rooms: the case study rises over the painting like a darkened gallery wall. */
	.rooms{position:relative;padding:18vh var(--edge) 12vh;background:linear-gradient(180deg,#17160f00,#17160fe6 14vh,#17160ff5 30vh)}
	.room{max-width:1120px;margin:0 auto;padding:11vh 0;border-top:1px solid #f7f4ec1a}.room:first-child{border-top:0}
	.room-label{display:flex;gap:14px;align-items:baseline;margin:0 0 28px;font-size:9px;letter-spacing:.12em;text-transform:uppercase;opacity:.65}.room-label span{font-weight:300;letter-spacing:.02em}
	h2{font:600 clamp(28px,3.4vw,52px)/1.08 var(--font-sans);letter-spacing:-.035em;margin:0;max-width:22ch;text-wrap:balance;color:var(--ink)}
	h2.lead{max-width:26ch;font-size:clamp(30px,3.8vw,58px)}
	.room-body,.statement-body>p{max-width:60ch;font-size:15px;line-height:1.75;opacity:.8;margin:30px 0 0}
	.statement-body{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:6vw;align-items:start}
	.wall-label{margin:30px 0 0;display:grid;gap:14px}.wall-label div{display:grid;grid-template-columns:90px 1fr;gap:16px;padding-bottom:14px;border-bottom:1px solid #f7f4ec14}.wall-label dt{font-size:9px;letter-spacing:.12em;text-transform:uppercase;opacity:.55;padding-top:2px}.wall-label dd{margin:0;font-size:13px;line-height:1.5}.wall-label a{text-decoration:underline;text-underline-offset:3px}
	.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:28px;margin:56px 0 0}.stats dt{font:300 clamp(40px,5vw,76px)/1 var(--font-sans);letter-spacing:-.04em}.stats dd{margin:12px 0 0;font-size:11px;line-height:1.5;opacity:.65;max-width:24ch}
	.items{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;margin:48px 0 0}.items article{padding:24px;border-radius:18px;background:#f7f4ec0a;border:1px solid #f7f4ec14}.items span{font-size:9px;opacity:.5;letter-spacing:.08em}.items h3{font:600 17px/1.25 var(--font-sans);letter-spacing:-.01em;margin:18px 0 10px}.items p{font-size:13px;line-height:1.6;opacity:.72;margin:0}
	.note{margin:48px 0 0;max-width:62ch;padding-left:22px;border-left:1px solid #f7f4ec40}.note span{font-size:9px;letter-spacing:.12em;text-transform:uppercase;opacity:.6}.note p{font-size:clamp(17px,1.6vw,22px);line-height:1.5;margin:12px 0 0;letter-spacing:-.01em}
	.artifact{margin:56px 0 0}.artifact-frame{--size:min(94vw - 2 * var(--edge),1120px);--fw:calc(var(--size) * .012);--mat:calc(var(--size) * .045);width:var(--size)}.artifact figcaption{margin-top:18px;font-size:11px;line-height:1.5;opacity:.6;max-width:70ch}
	.closing{text-align:center}.closing .room-label{justify-content:center}.closing blockquote{font:600 clamp(26px,3.2vw,48px)/1.2 var(--font-sans);letter-spacing:-.03em;max-width:28ch;margin:0 auto;text-wrap:balance}
	.live{display:flex;width:max-content;margin:0 auto}

	/* Next exhibition: the next painting waits behind a doorway. */
	.next{position:relative;display:grid;place-items:center;min-height:92svh;overflow:hidden;isolation:isolate}
	.next-painting{position:absolute;inset:0;z-index:-1;background-size:cover;background-position:var(--art-position);filter:brightness(.62);transition:transform 1.4s cubic-bezier(.2,.65,.3,1),filter .8s}
	.next:hover .next-painting{transform:scale(1.04);filter:brightness(.75)}
	.next-frame{--size:clamp(200px,20vw,300px);width:var(--size);aspect-ratio:1;justify-content:center}
	.next-copy{position:absolute;left:var(--edge);bottom:48px;display:flex;flex-direction:column;max-width:34vw}.next-copy strong{font:600 clamp(30px,3.4vw,54px)/1 var(--font-sans);letter-spacing:-.035em;margin-bottom:12px}
	.next-pill{position:absolute;right:var(--edge);bottom:44px}

	.exhibit a:focus-visible{outline:2px solid currentColor;outline-offset:6px}

	@media(max-width:760px){
		.exhibit{--edge:6vw}
		.identity{top:25px}.identity>a{font-size:19px}.identity p{font-size:8px}
		.back{top:22px;height:34px;padding:0 13px;font-size:10px}
		.status{left:var(--edge);transform:none;top:82px;height:32px;padding:0 13px 0 11px;font-size:10px;gap:8px}
		/* Phones stack the hero so the frame and the title can never overlap. */
		.hero{display:flex;flex-direction:column;align-items:stretch;justify-content:flex-end;gap:32px;padding:140px var(--edge) 150px}
		.frame{--size:min(64vw,300px)}.hero-frame{align-self:center}
		.hero-copy{position:static;max-width:none}
		h1{font-size:34px}
		.hero-label :global(.museum-label){bottom:72px}
		.enter{bottom:20px;left:var(--edge);transform:none}
		.rooms{padding-top:10vh}.room{padding:8vh 0}
		.statement-body{grid-template-columns:1fr;gap:0}
		.room-body,.statement-body>p{font-size:14px}
		.next-copy{max-width:none;right:var(--edge);bottom:96px}.next-pill{left:var(--edge);right:auto;bottom:36px}.next-frame{margin-bottom:120px}
	}
	@media(prefers-reduced-motion:reduce){.status-dot,.enter span{animation:none}.next-painting{transition:none}}
</style>
