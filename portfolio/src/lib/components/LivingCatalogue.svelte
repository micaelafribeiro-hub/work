<script lang="ts">
	let root: HTMLElement;
	const move = (event: PointerEvent) => {
		root?.style.setProperty('--mx', `${(event.clientX / innerWidth - .5) * 2}`);
		root?.style.setProperty('--my', `${(event.clientY / innerHeight - .5) * 2}`);
	};

	const works = [
		{
			no: '01', slug: 'cord', title: 'Cord', thesis: 'What are you worth?', signal: 'Research → revenue', metric: '91 voices', color: '#ff5b36',
			image: '/images/exhibition/cord-money-changer.webp', alt: 'A historical portrait of a money-changer',
			art: 'A Jewish Money-Changer · Workshop of Jean Baptiste Vanmour · 1700–1737'
		},
		{
			no: '02', slug: 'indie-campers', title: 'Indie Campers', thesis: 'Designing movement.', signal: 'Chaos → system', metric: '5M+ visits', color: '#536bff',
			image: '/images/exhibition/indie-travellers.webp', alt: 'A seventeenth-century landscape with travellers and an inn',
			art: 'Landscape with Travellers before an Inn · Salomon van Ruysdael · 1655'
		},
		{
			no: '03', slug: 'tenzo', title: 'Tenzo', thesis: 'Making service visible.', signal: 'Data → decisions', metric: '0→1', color: '#b99bff',
			image: '/images/exhibition/tenzo-still-life.webp', alt: 'A banquet still life with food and tableware',
			art: 'Still Life with a Turkey Pie · Pieter Claesz · 1627'
		}
	];
</script>

<svelte:window onpointermove={move} />

<main bind:this={root} class="living-catalogue">
	<nav class="lc-nav"><a href="/">MR</a><p>Product designer<br />Digital curator</p><div><a href="#works">Exhibitions</a><a href="/about">About</a><a href="mailto:micaela.f.ribeiro@gmail.com">Contact ↗</a></div></nav>

	<header class="lc-hero">
		<div class="hero-edition"><span>Catalogue 001</span><span>Lisbon / 2026</span></div>
		<div class="hero-copy"><p>Micaela Ribeiro presents</p><h1>The old<br />world, <em>re-coded.</em></h1><span>Product design as an act of curation.</span></div>
		<div class="hero-art">
			<img src="/images/exhibition/tenzo-still-life.webp" alt="Detail from Still Life with a Turkey Pie by Pieter Claesz" />
			<div class="hero-crop"></div><div class="scan-line"></div>
			<div class="future-orb"><i></i></div>
			<div class="object-label"><b>OBJECT DETECTED</b><span>Material / silver</span><span>Function / vessel</span><span>Status / transforming</span></div>
		</div>
		<div class="hero-note"><p>Classical images hold memory. Interfaces organise possibility. This is where they meet.</p><a href="#works">Begin the catalogue ↓</a></div>
	</header>

	<section class="collision"><p>Historical authority.</p><div class="collision-object"><span>+</span></div><p>Clinical possibility.</p></section>

	<section id="works" class="living-works">
		{#each works as work}
			<article class={`living-work work-${work.slug}`} style={`--work:${work.color};`}>
				<div class="work-stage">
					<img src={work.image} alt={work.alt} />
					<div class="work-shade"></div><div class="work-grid"></div>
					<div class="work-index"><span>Exhibition {work.no}</span><span>{work.signal}</span></div>
					<div class="work-title"><p>{work.thesis}</p><h2>{work.title}</h2></div>
					<div class="work-instrument">
						{#if work.slug === 'cord'}
							<div class="salary-dial"><span>MARKET SIGNAL</span><strong>£82.5k</strong><i></i></div>
						{:else if work.slug === 'indie-campers'}
							<div class="route-ui"><span>START</span><i></i><i></i><i></i><b>GO →</b></div>
						{:else}
							<div class="data-ui"><span>LIVE SERVICE</span><i style="--h:42%"></i><i style="--h:64%"></i><i style="--h:88%"></i><strong>+18%</strong></div>
						{/if}
					</div>
					<div class="work-meta"><span>{work.art}</span><span>{work.metric}</span><a href={`/work/${work.slug}`}>Enter project ↗</a></div>
				</div>
			</article>
		{/each}
	</section>

	<footer class="lc-ending"><p>Curatorial rule / 01</p><h2>Clear underneath.<br /><em>Unexpected on top.</em></h2><a href="mailto:micaela.f.ribeiro@gmail.com">Make something memorable ↗</a></footer>
</main>

<style>
	:global(.home-route:has(.living-catalogue)) { max-width: none; }
	.living-catalogue { --paper:#f1eee6; --ink:#111; color:var(--ink); background:var(--paper); overflow:clip; }
	.lc-nav { position:absolute; z-index:40; inset:0 0 auto; padding:1.2rem 1.5rem; display:grid; grid-template-columns:1fr auto 1fr; border-bottom:1px solid #aaa49a; font: .55rem/1.4 var(--font-mono); letter-spacing:.08em; text-transform:uppercase; }
	.lc-nav>a { font:2rem/.7 "Instrument Serif",serif; letter-spacing:-.04em; }.lc-nav p{margin:0;text-align:center}.lc-nav div{justify-self:end;display:flex;gap:1.5rem}
	.lc-hero { min-height:125svh; padding:8rem 3vw 3rem; display:grid; grid-template-columns:.72fr 1.28fr; grid-template-rows:auto 1fr auto; gap:2rem 4vw; }
	.hero-edition { grid-column:1/-1; display:flex; justify-content:space-between; font:.55rem var(--font-mono); letter-spacing:.08em; text-transform:uppercase; }
	.hero-copy { position:relative; z-index:5; align-self:center; }.hero-copy>p,.hero-copy>span{font:.55rem var(--font-mono);letter-spacing:.08em;text-transform:uppercase}.hero-copy h1{width:max-content;margin:2rem 0;font:400 clamp(6rem,13vw,14rem)/.68 "Instrument Serif",serif;letter-spacing:-.055em}.hero-copy h1 em{margin-left:.45em;font-weight:400}
	.hero-art { position:relative; min-height:78svh; overflow:hidden; background:#111; perspective:1000px; }.hero-art>img{width:100%;height:100%;object-fit:cover;transform:scale(1.06) translate(calc(var(--mx,0)*-1.2%),calc(var(--my,0)*-1.2%));transition:transform .4s ease-out;filter:saturate(.82)}
	.hero-crop{position:absolute;inset:0;background:linear-gradient(90deg,transparent 0 48%,rgba(83,107,255,.84) 48% 100%);mix-blend-mode:color;clip-path:polygon(53% 0,100% 0,100% 100%,38% 100%)}
	.scan-line{position:absolute;z-index:4;top:0;bottom:0;left:52%;width:1px;background:#d5ff2e;box-shadow:0 0 1.2rem #d5ff2e;animation:scan 5s ease-in-out infinite alternate}
	.future-orb{position:absolute;z-index:5;top:45%;left:50%;width:clamp(8rem,16vw,16rem);aspect-ratio:1;border-radius:50%;background:radial-gradient(circle at 32% 28%,#fff 0 3%,#d8ddff 8%,#536bff 30%,#10152f 69%,#000 100%);box-shadow:inset -1rem -1.5rem 2rem #0008,0 2rem 4rem #0008;transform:translate(-50%,-50%) translate(calc(var(--mx,0)*1.2rem),calc(var(--my,0)*1.2rem));transition:transform .25s ease-out}.future-orb i{position:absolute;inset:12%;border:1px solid #d5ff2e;border-radius:50%;transform:rotateX(70deg)}
	.object-label{position:absolute;z-index:6;right:1.5rem;bottom:1.5rem;width:12rem;padding:1rem;color:#d5ff2e;background:#0c1020dd;border:1px solid #d5ff2e;font:.48rem/1.7 var(--font-mono);letter-spacing:.05em}.object-label>*{display:block}.object-label b{margin-bottom:.5rem}
	.hero-note{grid-column:1/-1;display:flex;justify-content:space-between;align-items:end}.hero-note p{max-width:30rem;margin:0;font:1rem/1.6 var(--font-sans)}.hero-note a{font:.55rem var(--font-mono);letter-spacing:.08em;text-transform:uppercase}
	.collision{min-height:85svh;padding:8vw;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;color:#fff;background:#0c1020}.collision p{margin:0;font:400 clamp(3.5rem,7vw,8rem)/.9 "Instrument Serif",serif}.collision p:last-child{text-align:right;color:#aebcff}.collision-object{width:clamp(6rem,12vw,12rem);aspect-ratio:1;display:grid;place-items:center;border:1px solid #d5ff2e;border-radius:50%;box-shadow:0 0 4rem #536bff66}.collision-object span{font:3rem var(--font-mono);color:#d5ff2e}
	.living-work{height:165svh;position:relative}.work-stage{position:sticky;top:0;height:100svh;overflow:hidden;color:#fff;background:#111}.work-stage>img{width:100%;height:100%;object-fit:cover;transform:scale(1.08);filter:saturate(.72) contrast(1.05)}.work-shade{position:absolute;inset:0;background:linear-gradient(90deg,#000b,transparent 55%,#0005)}
	.work-grid{position:absolute;inset:0;background:linear-gradient(#fff2 1px,transparent 1px),linear-gradient(90deg,#fff2 1px,transparent 1px);background-size:5vw 5vw;mask-image:linear-gradient(90deg,transparent 30%,#000)}
	.work-index{position:absolute;z-index:3;inset:1.4rem 1.5rem auto;display:flex;justify-content:space-between;font:.54rem var(--font-mono);letter-spacing:.08em;text-transform:uppercase}.work-title{position:absolute;z-index:3;left:4vw;top:50%;transform:translateY(-50%)}.work-title p{margin:0 0 1rem;font:.58rem var(--font-mono);letter-spacing:.08em;text-transform:uppercase}.work-title h2{margin:0;font:400 clamp(7rem,16vw,17rem)/.65 "Instrument Serif",serif;letter-spacing:-.055em}
	.work-instrument{position:absolute;z-index:4;right:8vw;top:50%;transform:translateY(-50%) translate(calc(var(--mx,0)*.7rem),calc(var(--my,0)*.7rem));transition:transform .3s ease-out}.salary-dial{width:clamp(15rem,26vw,28rem);aspect-ratio:1;padding:2rem;display:flex;flex-direction:column;justify-content:space-between;border:1px solid #fff;border-radius:50%;background:radial-gradient(circle at 32% 25%,#fff,#aaa 7%,#222 40%,#050505 72%);box-shadow:0 3rem 7rem #000}.salary-dial span{font:.5rem var(--font-mono)}.salary-dial strong{font:400 clamp(3rem,6vw,6rem) "Instrument Serif",serif}.salary-dial i{position:absolute;inset:18%;border:1px solid var(--work);border-radius:50%;box-shadow:0 0 2rem var(--work)}
	.route-ui{width:clamp(18rem,34vw,36rem);height:18rem;padding:1.5rem;display:flex;align-items:center;gap:1rem;color:#d5ff2e;background:#536bffe8;border:1px solid #d5ff2e;box-shadow:0 3rem 7rem #0007}.route-ui span,.route-ui b{font:.55rem var(--font-mono)}.route-ui i{flex:1;height:1px;background:#d5ff2e}.route-ui i:nth-of-type(2){flex:.3;height:5rem;border:1px solid #d5ff2e;border-radius:50%;background:transparent}.route-ui b{padding:.8rem;border:1px solid #d5ff2e;border-radius:50%}
	.data-ui{width:clamp(18rem,34vw,36rem);height:21rem;padding:1.5rem;display:flex;align-items:end;gap:1rem;color:#111;background:#f7f5efeb;border:1px solid #111;box-shadow:1.5rem 1.5rem 0 var(--work)}.data-ui span{position:absolute;top:1.5rem;font:.52rem var(--font-mono)}.data-ui i{flex:1;height:var(--h);background:var(--work)}.data-ui strong{font:400 clamp(2.5rem,5vw,5rem) "Instrument Serif",serif}
	.work-meta{position:absolute;z-index:5;right:1.5rem;bottom:1.5rem;left:1.5rem;padding-top:1rem;display:grid;grid-template-columns:1fr 1fr auto;border-top:1px solid #fff8;font:.49rem var(--font-mono);letter-spacing:.06em;text-transform:uppercase}.work-meta span:nth-child(2){text-align:center}
	.lc-ending{min-height:100svh;padding:10vw 6vw;display:flex;flex-direction:column;justify-content:space-between;background:var(--paper)}.lc-ending p,.lc-ending a{font:.55rem var(--font-mono);letter-spacing:.08em;text-transform:uppercase}.lc-ending h2{margin:auto 0;font:400 clamp(5rem,11vw,12rem)/.76 "Instrument Serif",serif;letter-spacing:-.05em}.lc-ending h2 em{margin-left:.5em;font-weight:400}.lc-ending a{align-self:flex-end}
	@keyframes scan{to{left:72%}}
	@media(max-width:800px){.lc-nav{grid-template-columns:1fr 1fr}.lc-nav>p,.lc-nav div a:first-child{display:none}.lc-hero{grid-template-columns:1fr;padding:6rem .8rem 2rem}.hero-copy h1{font-size:clamp(5rem,25vw,8rem)}.hero-art{min-height:60svh}.hero-note{display:block}.hero-note a{display:inline-block;margin-top:2rem}.collision{grid-template-columns:1fr;gap:3rem}.collision p:last-child{text-align:left}.collision-object{justify-self:center}.work-title{top:22%;transform:none}.work-title h2{font-size:clamp(5rem,25vw,8rem)}.work-instrument{right:1rem;top:58%}.work-meta{grid-template-columns:1fr auto}.work-meta span:nth-child(2){display:none}.lc-ending h2{font-size:clamp(4.5rem,22vw,7rem)}}
	@media(prefers-reduced-motion:reduce){.scan-line{animation:none}.hero-art>img,.future-orb,.work-instrument{transition:none}}
</style>
