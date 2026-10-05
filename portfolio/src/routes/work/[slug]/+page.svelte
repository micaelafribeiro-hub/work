<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const project = $derived(data.project);
	const prev = $derived(data.prev);
	const next = $derived(data.next);

	const treatments: Record<string, { background: string; accent: string; signal: string; metric: string }> = {
		cord: { background: '#ff5b36', accent: '#ffd5c6', signal: 'Research → revenue', metric: '91' },
		'indie-campers': { background: '#c9ff2e', accent: '#536bff', signal: 'Chaos → system', metric: '5M+' },
		tenzo: { background: '#b99bff', accent: '#ffe15a', signal: 'Data → decisions', metric: '0→1' }
	};
	const treatment = $derived(treatments[project.slug]);
</script>

<svelte:head>
	<title>{project.title} · Micaela Ribeiro</title>
	<meta name="description" content={project.hook ?? project.subtitle} />
</svelte:head>

{#if project.slug === 'cord'}
	<article class="cord-exhibition">
		<nav class="exhibition-nav" aria-label="Exhibition navigation">
			<a href="/">M.R / Gallery</a>
			<span>Exhibition 01</span>
			<a href="/about">About</a>
		</nav>

		<header class="cord-threshold">
			<div class="threshold-index"><span>Exhibition 01</span><span>Product design / 2021–2023</span></div>
			<div class="threshold-title">
				<h1 style="view-transition-name: project-cord;">Cord</h1>
				<p>What happens when research uncovers a product no one asked for?</p>
			</div>
			<div class="threshold-installation" aria-label="An abstract salary intelligence installation">
				<div class="cord-doorway">
					<span>Research → revenue</span><strong>91</strong>
					<i class="doorway-ring ring-a"></i><i class="doorway-ring ring-b"></i><i class="doorway-plane"></i>
				</div>
			</div>
			<a class="threshold-enter" href="#curatorial-note"><span>Enter exhibition</span><i>↓</i></a>
		</header>

		<section id="curatorial-note" class="cord-curatorial">
			<div class="exhibition-label"><span>Room 01</span><span>Curatorial note</span></div>
			<div class="curatorial-statement">
				<p class="lead">A question asked without a brief became a new paid product in seven months.</p>
				<div class="curatorial-body">
					<p>Cord connected software engineers directly with hiring managers. The product worked, but acquisition had stalled and people rarely returned.</p>
					<p>I reframed the problem: what do engineers need when they are thinking about their career—not only when they are ready to apply?</p>
				</div>
			</div>
			<dl class="exhibition-caption">
				<div><dt>Artist</dt><dd>Micaela Ribeiro</dd></div><div><dt>Role</dt><dd>Solo product designer</dd></div>
				<div><dt>Medium</dt><dd>Research, strategy, product</dd></div><div><dt>Duration</dt><dd>7 months to paid</dd></div>
			</dl>
		</section>

		<section class="cord-room cord-research-room">
			<div class="room-intro">
				<div class="exhibition-label light"><span>Room 02</span><span>The evidence</span></div>
				<h2>Listen until the signal becomes impossible to ignore.</h2>
			</div>
			<div class="research-installation" aria-label="Research evidence from 91 participants">
				<strong class="research-number">91</strong><p class="research-subtitle">participants across the UK and EU</p>
				<div class="research-orbit" aria-hidden="true">
					<span style="--x:-42%; --y:-155%; --r:-7deg;">Active users</span>
					<span style="--x:75%; --y:-72%; --r:5deg;">Passive users</span>
					<span style="--x:-75%; --y:88%; --r:4deg;">Non-Cord users</span>
					<span style="--x:62%; --y:145%; --r:-4deg;">Not looking</span>
				</div>
			</div>
			<p class="room-note">Video interviews for depth. Surveys for scale. Analytics to understand disengagement. A market scan to see what everyone else had missed.</p>
		</section>

		<section class="cord-room cord-signal-room">
			<div class="exhibition-label"><span>Room 03</span><span>The signal</span></div>
			<div class="signal-composition">
				<div class="signal-figure"><strong>50%</strong><span>named fair pay as their biggest career challenge</span></div>
				<blockquote>“I want to know what I’m worth before I decide where to go.”</blockquote>
			</div>
			<div class="signal-reveal">
				<p>Cord already held thousands of job listings with salary ranges—and thousands of CVs with expectations attached.</p>
				<strong>The data was there.<br />The product wasn’t.</strong>
			</div>
		</section>

		<section class="cord-room cord-product-room">
			<div class="product-copy">
				<div class="exhibition-label"><span>Room 04</span><span>The intervention</span></div>
				<h2>Two experiences.<br />One insight.</h2>
				<p>A personalised dashboard gave existing users an immediate reason to return. A deliberately limited public experience turned the same intelligence into acquisition.</p>
			</div>
			<div class="product-installation" aria-label="Cord salary product shown as two spatial interface artefacts">
				<div class="browser-object browser-private">
					<div class="browser-bar"><i></i><i></i><i></i><span>cord.co/dashboard</span></div>
					<div class="browser-content"><span>Your salary benchmark</span><strong>£82,500</strong><div class="salary-chart"><i></i><i></i><i></i><i></i><i></i><i></i></div><p>Based on your role, location and experience.</p></div>
					<b>01 / Personal</b>
				</div>
				<div class="browser-object browser-public">
					<div class="browser-bar"><i></i><i></i><i></i><span>cord.co/salary-tool</span></div>
					<div class="browser-content public-content"><span>Salary insights</span><strong>Know your worth.</strong><div class="search-field">Product designer <i>→</i></div><p>Live market data for people building their next move.</p></div>
					<b>02 / Public</b>
				</div>
				<div class="product-shadow" aria-hidden="true"></div>
			</div>
		</section>

		<section class="cord-room cord-outcome-room">
			<div class="outcome-heading">
				<div class="exhibition-label"><span>Room 05</span><span>The consequence</span></div>
				<h2>Research became a business decision.</h2>
			</div>
			<div class="outcome-timeline">
				<div><span>Launch week</span><strong>↑</strong><p>Active users increased</p></div>
				<div><span>After launch</span><strong>↑</strong><p>Significant reactivation lift</p></div>
				<div class="outcome-final"><span>Month seven</span><strong>Paid</strong><p>A new subscription tier</p></div>
			</div>
			<p class="outcome-note">Not executing a brief. Identifying where the product could go—and building the case to take it there.</p>
			<a class="live-piece" href="https://cord.co/salary-tool" target="_blank" rel="noopener noreferrer"><span>View the live piece</span><i>↗</i></a>
		</section>

		<footer class="exhibition-exit">
			<p>Exhibition 01 / Cord</p>
			{#if next}<a href={`/work/${next.slug}`}><span>Continue to Exhibition 02</span><strong>{next.title}</strong><i>→</i></a>{/if}
		</footer>
	</article>
{:else}
	<article class="story-case" style={`--story-color:${treatment.background}; --story-accent:${treatment.accent};`}>
		<nav class="story-nav" aria-label="Case study navigation"><a href="/">← Back home</a><a href="/about">About</a></nav>
		<header class="story-hero">
			<div class="story-hero-copy"><p>{project.role} · {project.yearRange}</p><h1 style={`view-transition-name: project-${project.slug};`}>{project.title}</h1><h2>{project.subtitle}</h2></div>
			<div class="story-hero-art" aria-label={project.heroImage?.description ?? `${project.title} project hero`}><span>{treatment.signal}</span><strong>{treatment.metric}</strong><div class="story-orbit orbit-one" aria-hidden="true"></div><div class="story-orbit orbit-two" aria-hidden="true"></div></div>
			<a href="#story-about" class="story-scroll">Scroll to begin <span>↓</span></a>
		</header>
		<section id="story-about" class="story-about">
			<div class="story-section-label"><span>01</span><p>About the project</p></div>
			<div class="story-about-copy"><h2>{project.hook}</h2><p>{project.sections[0]?.body}</p>{#if project.sections[0]?.callout}<aside class="story-about-note"><span>{project.sections[0].callout.label}</span><p>{project.sections[0].callout.body}</p></aside>{/if}</div>
			<dl class="story-meta">{#each project.meta.slice(0, 4) as field}<div><dt>{field.label}</dt><dd>{field.value}</dd></div>{/each}</dl>
		</section>
		{#each project.sections.slice(1) as section, i}
			<section class:story-chapter-tint={i % 2 === 1} class="story-chapter">
				<header class="story-chapter-copy"><div class="story-section-label"><span>{String(i + 2).padStart(2, '0')}</span><p>{section.eyebrow}</p></div><h2>{section.heading}</h2>{#if section.body}<p>{section.body}</p>{/if}</header>
				{#if section.stats}<dl class="story-stats">{#each section.stats as stat}<div><dt>{stat.value}</dt><dd>{stat.label}</dd></div>{/each}</dl>{/if}
				{#if section.images}<div class="story-media-grid">{#each section.images.slice(0, 1) as image}<figure class="story-media" aria-label={image.description}><div class="story-media-stage"><span>Artifact 01 / {image.ratio}</span><strong>{String(i + 2).padStart(2, '0')}</strong><p>{project.title} / {section.heading}</p></div></figure>{/each}</div>{/if}
				{#if section.items}<div class="story-items">{#each section.items as item, itemIndex}<article><span>{String(itemIndex + 1).padStart(2, '0')}</span><h3>{item.title}</h3><p>{item.body}</p></article>{/each}</div>{/if}
				{#if section.callout}<aside class="story-callout"><span>{section.callout.label}</span><p>{section.callout.body}</p></aside>{/if}
				{#if section.reflection}<aside class="story-reflection"><span>{section.reflection.label}</span><p>{section.reflection.body}</p></aside>{/if}
			</section>
		{/each}
		{#if project.quote}<section class="story-quote"><span>What remains</span><blockquote>“{project.quote}”</blockquote></section>{/if}
		<footer class="story-next"><p>End of case {project.no}</p>{#if next}<a href={`/work/${next.slug}`}><span>Next project</span><strong>{next.title}</strong><i>↗</i></a>{:else if prev}<a href={`/work/${prev.slug}`}><span>Previous project</span><strong>{prev.title}</strong><i>↗</i></a>{/if}</footer>
	</article>
{/if}
