<script lang="ts">
	const experience = [
		{
			years: '2026',
			role: 'Lead Product Design',
			company: 'Indie Campers',
			note: 'Most senior designer in the company. Design end-to-end across consumer, internal tools, and the Client Area marketplace.'
		},
		{
			years: '2024–26',
			role: 'Senior Product Designer',
			company: 'Indie Campers',
			note: "First product designer at the company in years. Built the design system from scratch in under 6 months with AI-assisted workflows; redesigned the booking funnel end-to-end."
		},
		{
			years: '2023–24',
			role: 'Senior Product Designer',
			company: 'Tenzo',
			note: 'First designer at a Series A restaurant analytics platform. Customers: IHG, Time Out Market, Pokéhouse, MJMK.'
		},
		{
			years: '2021–23',
			role: 'Product Designer',
			company: 'Cord',
			note: 'Recruitment messaging platform. Led the research that turned into the Salary Benchmarking Tool, which became a paid subscription within seven months and a new revenue stream for the company.'
		},
		{
			years: '2019–21',
			role: 'UI/UX Designer',
			company: 'Comma Secured',
			note: 'Founding designer for a consumer drone-security startup. Shipped mobile and web products with top App Store and Play Store ratings.'
		},
		{
			years: '2019',
			role: 'Junior Digital Designer',
			company: 'Wecorp Industries',
			note: 'Founding designer for an AI-enabled drone control platform in the defence sector.'
		},
		{
			years: '2018',
			role: 'Lead Graphic Design Intern',
			company: 'Resurgence',
			note: 'Publications and frameworks for the World Bank and the United Nations: Design for Impact Framework, and Open Data Infrastructure for City Resilience.'
		},
		{
			years: '2015',
			role: 'Junior Graphic Designer',
			company: 'Selfridges',
			note: 'London.'
		}
	];
</script>

<svelte:head>
	<title>About · Micaela</title>
	<meta
		name="description"
		content="Micaela Ribeiro de Brito, Lead Product Designer at Indie Campers. Lisbon. Bio, practice, and experience."
	/>
</svelte:head>

<section
	class="px-5 sm:px-6 md:px-12 pt-10 sm:pt-16 md:pt-24 pb-10 sm:pb-12 grid grid-cols-12 gap-x-4 sm:gap-x-6 gap-y-6"
>
	<p class="eyebrow col-span-12 md:col-span-3">About</p>
	<h1 class="display-xl col-span-12 md:col-span-9">
		Designer, <em class="italic">researcher</em>, builder.
	</h1>
</section>

<section
	class="px-5 sm:px-6 md:px-12 py-16 sm:py-24 rule grid grid-cols-12 gap-x-4 sm:gap-x-6 gap-y-6"
>
	<h2 class="eyebrow col-span-12 md:col-span-3 self-start">Bio</h2>
	<div class="col-span-12 md:col-span-9 max-w-[60ch] space-y-6 sm:space-y-7">
		<p class="font-serif text-2xl md:text-3xl leading-[1.2]">
			I'm a product design leader in Lisbon, and I've been the first designer in the room four
			times.
		</p>
		<p class="text-lg leading-[1.65]">
			That shaped how I work. I don't wait for a brief. I look for where the product could go, then
			build the case to take it there.
		</p>
		<p class="text-lg leading-[1.65]">
			Six years in, the thing I care about hasn't changed: the moment a research insight becomes a
			decision someone with a budget actually makes. I tie interface choices to conversion. I
			build the system, the rituals, and the team, then hand people something real to step into.
			Culture outlasts any single screen I'll ever ship, so I build that first.
		</p>
		<p class="text-lg leading-[1.65]">
			Right now I lead design at <span class="italic">Indie Campers</span> across product, brand,
			and creative direction. 850,000+ customers, 20+ countries, one practice built from zero.
		</p>
	</div>
</section>

<section
	class="px-5 sm:px-6 md:px-12 py-16 sm:py-24 rule grid grid-cols-12 gap-x-4 sm:gap-x-6 gap-y-6"
>
	<h2 class="eyebrow col-span-12 md:col-span-3 self-start">Practice</h2>
	<dl
		class="col-span-12 md:col-span-9 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10 sm:gap-y-12"
	>
		<div>
			<dt class="font-serif text-2xl leading-tight">Product Design Leadership</dt>
			<dd class="mt-3 sm:mt-4 text-[var(--color-muted)] leading-[1.6] max-w-[34ch]">
				End-to-end design across complex product suites. Founding design practices, defining
				rituals, hiring the next designer.
			</dd>
		</div>
		<div>
			<dt class="font-serif text-2xl leading-tight">Design + Code</dt>
			<dd class="mt-3 sm:mt-4 text-[var(--color-muted)] leading-[1.6] max-w-[34ch]">
				Opening PRs alongside engineers, customising design-system primitives in the codebase,
				AI-assisted workflows. Still learning, already shipping.
			</dd>
		</div>
		<div>
			<dt class="font-serif text-2xl leading-tight">Art Direction</dt>
			<dd class="mt-3 sm:mt-4 text-[var(--color-muted)] leading-[1.6] max-w-[34ch]">
				Brand and physical production beyond the screen: depot signage across 20+ markets,
				photography and video overhauls, identity that holds the system together.
			</dd>
		</div>
	</dl>
</section>

<section
	class="px-5 sm:px-6 md:px-12 py-16 sm:py-24 rule grid grid-cols-12 gap-x-4 sm:gap-x-6 gap-y-8"
>
	<h2 class="eyebrow col-span-12 md:col-span-3 self-start">Experience</h2>
	<ol class="col-span-12 md:col-span-9 flex flex-col">
		{#each experience as item, i}
			<li
				class="grid grid-cols-12 gap-x-4 sm:gap-x-6 gap-y-2 py-5 sm:py-6 {i > 0 ? 'rule' : ''}"
			>
				<span class="eyebrow tabular-nums col-span-12 sm:col-span-3 self-start text-[var(--color-muted)]">
					{item.years}
				</span>
				<div class="col-span-12 sm:col-span-9">
					<h3 class="font-serif text-2xl leading-[1.1]">
						{item.role}
						<span class="text-[var(--color-muted)]"> · </span>
						<span class="italic">{item.company}</span>
					</h3>
					<p class="mt-2 text-[var(--color-muted)] leading-[1.6] max-w-[56ch]">
						{item.note}
					</p>
				</div>
			</li>
		{/each}
	</ol>
</section>

<section
	class="px-5 sm:px-6 md:px-12 py-16 sm:py-24 rule grid grid-cols-12 gap-x-4 sm:gap-x-6 gap-y-6"
>
	<h2 class="eyebrow col-span-12 md:col-span-3 self-start">Contact</h2>
	<ul class="col-span-12 md:col-span-9 font-serif text-2xl md:text-3xl space-y-1">
		<li>
			<a
				href="mailto:micaela.f.ribeiro@gmail.com"
				class="inline-flex items-center min-h-[2.75rem] py-1 hover:italic focus-visible:italic"
			>
				Email →
			</a>
		</li>
		<li>
			<a
				href="https://www.linkedin.com/in/micaelapatriciafr/"
				rel="noopener noreferrer"
				target="_blank"
				class="inline-flex items-center min-h-[2.75rem] py-1 hover:italic focus-visible:italic"
			>
				LinkedIn →
			</a>
		</li>
	</ul>
</section>
