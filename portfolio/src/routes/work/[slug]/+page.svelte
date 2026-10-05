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
	const live = $derived(project.meta.find((field) => field.href));
	const facts = $derived(project.meta.filter((field) => !field.href));

	// "Track 1 · Building the practice" → kicker "Track 1", title "Building the practice".
	const chapterTitle = (eyebrow: string) => {
		const [kicker, title] = eyebrow.split(' · ');
		return title ? { kicker, title } : { kicker: '', title: kicker };
	};

	// Story pacing: each block fades up as it scrolls into view.
	function reveal(node: HTMLElement) {
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		node.classList.add('pre-reveal');
		const observer = new IntersectionObserver(([entry]) => {
			if (!entry.isIntersecting) return;
			node.classList.remove('pre-reveal');
			observer.disconnect();
		}, { rootMargin: '0px 0px -12% 0px' });
		observer.observe(node);
		return { destroy: () => observer.disconnect() };
	}

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

	<a class="back exhibit-ui" style:view-transition-name="exhibit-back" href="/" aria-label="Back to the gallery"><span aria-hidden="true">←</span>Gallery<span class="back-index">{pieceNumber(index)} / {pieceNumber(collection.length - 1)}</span></a>

	<header class="hero exhibit-ui" style:view-transition-name={`hero-${project.slug}`}>
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
	</header>

	<div class="rooms exhibit-ui" style:view-transition-name={`rooms-${project.slug}`}>
		<section id="about" class="wall about">
			<p class="kicker" use:reveal>About the project</p>
			<h2 class="about-title" use:reveal>{project.subtitle}</h2>
			<div class="about-grid">
				<p class="about-story" use:reveal>{project.hook}</p>
				<dl class="facts" use:reveal>
					{#each facts as field}<div><dt>{field.label}</dt><dd>{field.value}</dd></div>{/each}
					{#if live}<a class="visit" href={live.href} target="_blank" rel="noopener noreferrer">Visit {live.value} <span aria-hidden="true">→</span></a>{/if}
				</dl>
			</div>
			{#if project.heroImage}
				<figure class="showcase" use:reveal>
					<div class="frame showcase-frame" style:aspect-ratio={ratio(project.heroImage.ratio)} aria-label={project.heroImage.description}>
						<span class="placeholder-top"><span>Overview</span><span>{project.heroImage.ratio}</span></span>
						<span class="placeholder-center"><span class="cross" aria-hidden="true">+</span><span class="image-label">Image to come</span></span>
						<span class="placeholder-bottom"><span>{project.title}</span><span>{project.yearRange}</span></span>
					</div>
					<figcaption>{project.heroImage.caption ?? `An overview of ${project.title}, ${project.yearRange}.`}</figcaption>
				</figure>
			{/if}
		</section>

		{#each project.sections as section, i}
			{@const chapter = chapterTitle(section.eyebrow)}
			<section class="wall chapter">
				<header class="chapter-head" use:reveal>
					<span class="chapter-number">{pieceNumber(i)}</span>
					<h2>{chapter.title}</h2>
					{#if chapter.kicker}<p class="kicker">{chapter.kicker}</p>{/if}
				</header>

				<div class="beat" use:reveal>
					<h3>{section.heading}</h3>
					{#if section.body}<p>{section.body}</p>{/if}
				</div>

				{#if section.stats}
					<dl class="stats" use:reveal>{#each section.stats as stat}<div><dt>{stat.value}</dt><dd>{stat.label}</dd></div>{/each}</dl>
				{/if}

				{#if section.images?.[0]}
					{@const image = section.images[0]}
					<figure class="artifact" use:reveal>
						<div class="frame artifact-frame" style:aspect-ratio={ratio(image.ratio)} aria-label={image.description}>
							<span class="placeholder-top"><span>{pieceNumber(i)}.1</span><span>{image.ratio}</span></span>
							<span class="placeholder-center"><span class="cross" aria-hidden="true">+</span><span class="image-label">Image to come</span></span>
							<span class="placeholder-bottom"><span>{project.title}</span><span>{chapter.title}</span></span>
						</div>
						{#if image.caption}<figcaption>{image.caption}</figcaption>{/if}
					</figure>
				{/if}

				{#each section.items ?? [] as item}
					<div class="beat beat-small" use:reveal><h4>{item.title}</h4><p>{item.body}</p></div>
				{/each}

				{#if section.images && section.images.length > 1}
					<div class="artifact-grid">
						{#each section.images.slice(1) as image, imageIndex}
							<figure class="artifact" use:reveal>
								<div class="frame artifact-frame" style:aspect-ratio={ratio(image.ratio)} aria-label={image.description}>
									<span class="placeholder-top"><span>{pieceNumber(i)}.{imageIndex + 2}</span><span>{image.ratio}</span></span>
									<span class="placeholder-center"><span class="cross" aria-hidden="true">+</span><span class="image-label">Image to come</span></span>
									<span class="placeholder-bottom"><span>{project.title}</span><span>{chapter.title}</span></span>
								</div>
								{#if image.caption}<figcaption>{image.caption}</figcaption>{/if}
							</figure>
						{/each}
					</div>
				{/if}

				{#if section.reflection}<aside class="reflection" use:reveal><span>{section.reflection.label}</span><p>{section.reflection.body}</p></aside>{/if}
			</section>

			{#if section.callout}
				<!-- An interlude: the wall opens and the painting shows through. -->
				<aside class="interlude" class:long={section.callout.body.length > 180} use:reveal><span class="kicker">{section.callout.label}</span><p>{section.callout.body}</p></aside>
			{/if}
		{/each}

		{#if project.quote}
			<aside class="interlude closing" use:reveal><span class="kicker">What remains</span><blockquote>“{project.quote}”</blockquote></aside>
		{/if}
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
	.status,.back,.pill{display:inline-flex;align-items:center;gap:10px;height:38px;padding:0 16px;border-radius:999px;background:#1c1f185e;backdrop-filter:blur(12px);font-size:11px;letter-spacing:.02em;white-space:nowrap;transition:background .25s}
	.status:hover,.back:hover,.pill:hover{background:#1c1f1899}
	.status{position:absolute;left:50%;top:31px;transform:translateX(-50%);padding-left:14px}.status-dot{width:7px;height:7px;border-radius:50%;background:#5fd38d;animation:status-pulse 2.4s ease-out infinite}.status-arrow{font-size:12px;transition:transform .25s}.status:hover .status-arrow{transform:translate(2px,-2px)}
	@keyframes status-pulse{0%{box-shadow:0 0 0 0 #5fd38d80}70%{box-shadow:0 0 0 7px #5fd38d00}100%{box-shadow:0 0 0 0 #5fd38d00}}
	.back{position:fixed;z-index:5;right:var(--edge);top:31px}.back-index{opacity:.55;font-size:9px;margin-left:4px}

	/* Hero: the framed piece on the painting, title bottom-left as on the gallery. */
	.hero{position:relative;z-index:1;min-height:76svh;display:grid;place-items:center;padding:70px 0 20px}
	.frame{--size:clamp(260px,30vw,430px);--fw:calc(var(--size) * .025);--mat:calc(var(--size) * .1);position:relative;display:flex;flex-direction:column;justify-content:space-between;margin:0;color:#373a33;background:#f0ede5;border:var(--fw) solid;border-image:linear-gradient(160deg,#2b2b2b,#111 45%,#1d1d1d) 1;padding:calc(var(--mat) + 12px);box-shadow:inset 0 3px 6px -2px #0008,inset 0 0 0 var(--mat) #f8f6f0,inset 0 0 0 calc(var(--mat) + 1.5px) #00000026,0 2px 3px #0006,0 16px 24px -6px #0000008c,0 42px 70px -18px #00000080}
	.frame::after{content:'';position:absolute;inset:calc(var(--fw) * -1);pointer-events:none;box-shadow:inset 1px 1px 0 #ffffff4d,inset -1px -1px 0 #0000006b,inset 0 0 0 1px #0003}
	.hero-frame{--size:clamp(220px,min(30vw,54svh),430px);width:var(--size);aspect-ratio:1}
	.placeholder-top,.placeholder-bottom{display:flex;justify-content:space-between;gap:12px;font-size:8px;letter-spacing:.06em}.placeholder-bottom{opacity:.48;font-size:7px;text-transform:uppercase}.placeholder-center{display:flex;align-items:center;flex-direction:column;gap:11px;text-align:center}.cross{font:200 27px/1 var(--font-sans);opacity:.3}.frame-title{font:600 clamp(24px,2.6vw,38px)/1.1 var(--font-sans);letter-spacing:-.03em}.image-label{font-size:8px;letter-spacing:.08em;opacity:.55}
	.hero-copy{position:absolute;left:var(--edge);bottom:48px;max-width:30vw}
	.category{font-size:8px;text-transform:uppercase;letter-spacing:.12em;margin:0 0 15px;opacity:.7}
	h1{font:600 clamp(30px,3.4vw,54px)/1 var(--font-sans);letter-spacing:-.035em;margin:0 0 12px;color:var(--ink)}
	.description{font-size:11px;line-height:1.5;margin:0;opacity:.85}
	.hero-label :global(.museum-label){position:absolute}

	/* The story: chapters on a dark wall, read like the reference case study —
	   a short title and its paragraph side by side, then the evidence, framed. */
	.rooms{position:relative}
	.exhibit{--column:max(var(--edge),(100vw - 1120px) / 2)}
	.wall{position:relative;padding:12vh var(--column);background:#17160ff2}
	.kicker{font-size:9px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;opacity:.65;margin:0 0 18px}
	h2{font:600 clamp(34px,4.6vw,72px)/1.02 var(--font-sans);letter-spacing:-.04em;margin:0;text-wrap:balance;color:var(--ink)}
	.about{padding-top:4vh}
	.about-title{max-width:16ch}
	.about-grid{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(0,1fr);gap:8vw;margin-top:7vh;align-items:start}
	.about-story{font-size:clamp(16px,1.35vw,19px);line-height:1.7;margin:0;opacity:.85;max-width:56ch}
	.facts{margin:0;display:grid;gap:26px}.facts dt{font-size:9px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;opacity:.55}.facts dd{margin:8px 0 0;font-size:14px;line-height:1.5}
	.visit{display:inline-flex;gap:10px;align-items:center;font-size:10px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;padding-block:6px}.visit span{transition:transform .25s}.visit:hover span{transform:translateX(4px)}
	.showcase{margin:14vh 0 0}.showcase-frame{--size:min(100vw - 2 * var(--edge),1120px);--fw:calc(var(--size) * .012);--mat:calc(var(--size) * .045);width:100%}
	figcaption{margin-top:20px;text-align:center;font-size:12px;font-style:italic;line-height:1.5;opacity:.6}
	.chapter{padding-top:16vh}
	.chapter-head{display:grid;gap:10px;margin-bottom:9vh}.chapter-head .kicker{margin:6px 0 0}
	.chapter-number{font-size:11px;font-weight:600;letter-spacing:.08em;opacity:.7}
	.beat{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.15fr);gap:6vw;align-items:start;margin-top:8vh}
	.beat h3{font:600 clamp(22px,2.2vw,32px)/1.18 var(--font-sans);letter-spacing:-.025em;margin:0;text-wrap:balance}
	.beat h4{font:600 clamp(17px,1.5vw,21px)/1.25 var(--font-sans);letter-spacing:-.015em;margin:0}
	.beat p{font-size:clamp(15px,1.2vw,17px);line-height:1.7;margin:0;opacity:.8;max-width:56ch}
	.chapter-head+.beat{margin-top:0}
	.beat-small{margin-top:7vh;padding-top:7vh;border-top:1px solid #f7f4ec14}
	.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:28px;margin:10vh 0 0}.stats dt{font:300 clamp(44px,5.6vw,84px)/1 var(--font-sans);letter-spacing:-.045em}.stats dd{margin:14px 0 0;font-size:12px;line-height:1.5;opacity:.65;max-width:24ch}
	.artifact{margin:12vh 0 0}.artifact-frame{--size:min(100vw - 2 * var(--edge),1120px);--fw:calc(var(--size) * .012);--mat:calc(var(--size) * .045);width:100%}
	.artifact-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr));gap:4vw}.artifact-grid .artifact-frame{--size:min(48vw,560px)}
	.reflection{margin:10vh auto 0;max-width:62ch;padding-left:22px;border-left:1px solid #f7f4ec40}.reflection span{font-size:9px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;opacity:.6}.reflection p{font-size:clamp(16px,1.4vw,19px);line-height:1.6;margin:12px 0 0}
	/* Interludes leave the wall open so the fixed painting shows through. */
	.interlude{position:relative;display:grid;place-content:center;justify-items:center;text-align:center;min-height:78svh;padding:16vh var(--column);background:radial-gradient(ellipse 60% 52% at 50% 50%,#17160fd9,#17160fa6 55%,#17160f40 100%),linear-gradient(180deg,#17160ff2,#17160f00 24%,#17160f00 76%,#17160ff2)}
	.interlude p,.interlude blockquote{font:600 clamp(24px,2.8vw,42px)/1.22 var(--font-sans);letter-spacing:-.025em;max-width:26ch;margin:0;text-wrap:balance;text-shadow:0 1px 18px #000c}
	.interlude.long p{font-size:clamp(20px,2vw,30px);line-height:1.35;max-width:34ch}
	.interlude .kicker{opacity:.8;text-shadow:0 1px 12px #000c}
	.closing{min-height:90svh}
	/* Reveal on scroll: only applied when JavaScript is running. */
	:global(.pre-reveal){opacity:0;transform:translateY(28px)}
	.rooms :global([class]){transition:opacity .9s cubic-bezier(.2,.65,.3,1),transform 1.1s cubic-bezier(.2,.65,.3,1)}

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
		.hero{min-height:0;display:flex;flex-direction:column;align-items:stretch;justify-content:flex-end;gap:24px;padding:128px var(--edge) 96px}
		.frame{--size:min(64vw,300px)}.hero-frame{--size:min(56vw,250px);align-self:center}
		.hero-copy{position:static;max-width:none}
		h1{font-size:34px}
		.hero-label :global(.museum-label){bottom:28px}
		.wall{padding:9vh var(--edge)}.about{padding-top:2vh}
		.about-grid,.beat{grid-template-columns:1fr;gap:22px}
		.chapter{padding-top:12vh}.chapter-head{margin-bottom:6vh}
		.interlude{min-height:64svh}
		.next-copy{max-width:none;right:var(--edge);bottom:96px}.next-pill{left:var(--edge);right:auto;bottom:36px}.next-frame{margin-bottom:120px}
	}
	/* Short screens: keep the start of the first room above the fold. */
	@media(min-width:761px) and (max-height:650px){.hero{min-height:70svh}}
	@media(max-width:760px) and (max-height:720px){.hero{gap:16px;padding:118px var(--edge) 86px}.hero-frame{--size:min(44vw,170px);padding:calc(var(--mat) + 6px)}.hero-frame :is(.placeholder-top,.placeholder-bottom,.image-label){display:none}.hero-frame .placeholder-center{margin:auto}.hero-frame .frame-title{font-size:20px}h1{font-size:28px}.category{margin-bottom:10px}}
	@media(max-width:760px) and (max-height:600px){.hero-frame{--size:min(40vw,135px)}.description{display:none}}
	@media(prefers-reduced-motion:reduce){.status-dot{animation:none}.next-painting{transition:none}}
</style>
