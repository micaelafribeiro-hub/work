export type StatCallout = { value: string; label: string };
export type ItemCard = { title: string; body: string };
export type Callout = { label: string; body: string };
export type MetaField = { label: string; value: string; href?: string };

export type CaseImage = {
	ratio: '21:9' | '16:9' | '3:2' | '4:3' | '1:1' | '3:4' | '9:16';
	description: string;
	caption?: string;
	/** When set, the actual asset is rendered instead of the placeholder. */
	src?: string;
};

export type CaseSection = {
	eyebrow: string;
	heading: string;
	body?: string;
	items?: ItemCard[];
	stats?: StatCallout[];
	callout?: Callout;
	reflection?: Callout;
	images?: CaseImage[];
};

export type Project = {
	slug: string;
	no: string;
	title: string;
	subtitle: string;
	hook?: string;
	role: string;
	year: string;
	yearRange: string;
	heroImage?: CaseImage;
	meta: MetaField[];
	sections: CaseSection[];
	quote?: string;
};

export const projects: Project[] = [
	{
		slug: 'cord',
		no: '01',
		title: 'Cord',
		subtitle: 'From research insight to revenue stream',
		hook: 'How a question I asked unprompted became a paid subscription product, in seven months.',
		role: 'Product Designer',
		year: '2021–23',
		yearRange: '2021–2023',
		heroImage: {
			ratio: '16:9',
			description:
				'Hero shot of the Salary Benchmarking Tool live at cord.co/salary-tool. Best option: a clean capture of the public salary page with the headline chart visible, or a device mockup of the logged-in dashboard. Aim for editorial calm.'
		},
		meta: [
			{ label: 'Company', value: 'Cord' },
			{ label: 'Role', value: 'Product Designer (solo)' },
			{ label: 'Timeline', value: 'Research to launch in 3–6 months. Paid within 7.' },
			{ label: 'Methods', value: 'Interviews · Surveys · Analytics · Competitor analysis · Heuristic evaluation' },
			{ label: 'Live', value: 'cord.co/salary-tool', href: 'https://cord.co/salary-tool' }
		],
		sections: [
			{
				eyebrow: 'Act 1 · The problem',
				heading: "We weren't asking why people really came to Cord",
				body: "Cord's core product was a recruitment messaging tool, connecting software engineers directly with hiring managers at tech companies. The product worked. But organic acquisition was stagnant, reactivation rates were low, and the team was focused on retention features for already-active users. I started asking a different question: what do engineers actually want when they're thinking about their career, not just when they're actively applying?",
				callout: {
					label: 'My initiative',
					body: "This project wasn't assigned to me. I identified the opportunity, defined the research scope, wrote the script, ran the calls, and synthesised the findings into a full product proposal. Then I presented it at a company all-hands and got the green light."
				}
			},
			{
				eyebrow: 'Act 2 · The research',
				heading: 'A research programme at scale, then the insight hiding in plain sight',
				body: "I ran a comprehensive research programme across the UK and EU: 91 participants, mixed across active, passive, and not-looking users, and across cord and non-cord users. Video interviews for depth, surveys for scale. I designed the script, ran the calls, and analysed the data.",
				images: [
					{
						ratio: '4:3',
						description:
							'Research artefact: a redacted slide from the research presentation, an affinity map of interview themes, or a "research wall" photo. The point is to show the rigour behind the insight, not pretty UI. Black-and-white reads well at this scale.',
						caption: 'Example: a slide from the research deck, or themed quotes from interviews.'
					}
				],
				stats: [
					{ value: '91', label: 'Total participants' },
					{ value: '58', label: 'Cord users interviewed' },
					{ value: '32', label: 'Non-cord users interviewed' },
					{ value: '86%', label: 'Rated salary insights "very useful"' }
				],
				items: [
					{ title: 'Video interviews', body: 'Active, passive, and not-looking users. Cord users and non-cord users.' },
					{ title: 'Survey', body: '91 respondents in total. Quantitative validation at scale.' },
					{ title: 'Analytics', body: 'Mapping where users disengaged and what they returned for.' },
					{ title: 'Competitor analysis', body: 'Career intelligence market scan, run by a parallel team.' }
				],
				callout: {
					label: 'The key insight',
					body: "Across every cut of the data, one topic dominated: salary intelligence. 50% of respondents named understanding fair pay as the single biggest challenge in deciding where to work. Cord already had thousands of job listings with salary ranges, and thousands of CVs with salary expectations attached. Nobody had connected the dots."
				}
			},
			{
				eyebrow: 'Act 3 · The product',
				heading: 'Two experiences, one insight',
				body: "I proposed a two-phase rollout. First, a logged-in experience: a personalised salary dashboard that drew from each Cord user's existing profile, so they got highly relevant information with no extra effort. We ran this for a couple of months. Then phase two: a public Salary Page on Cord's landing page, with deliberate restrictions and sign-up gating, so the same data could pull non-users into the funnel through SEO.",
				images: [
					{
						ratio: '16:9',
						description:
							'Product screens of the SBT. Best option: a side-by-side of the logged-in personalised dashboard and the public salary page, showing the two-experience strategy. Marketing-screenshot quality.',
						caption: 'Example: logged-in personalised view (left) and public salary page (right).'
					}
				],
				items: [
					{
						title: 'Logged-in experience',
						body: "Personalised salary data drawn from the user's existing Cord profile. Minimum effort for maximum signal."
					},
					{
						title: 'Public salary page',
						body: 'SEO-driven acquisition surface with sign-up gating. Enough value to want it, enough friction to register.'
					},
					{
						title: 'Double-diamond process',
						body: 'Discover, Define, Design, Test, Deliver. Low-fi prototypes, stakeholder reviews, high-fi, copy passes, heuristic evaluation, ship.'
					},
					{
						title: 'Live in production',
						body: 'cord.co/salary-tool. Still running today.'
					}
				]
			},
			{
				eyebrow: 'Outcomes',
				heading: 'A research question became a business decision',
				body: 'The feature shipped in three to six months from research to launch. Active users went up in the first week and reactivation lifted significantly. Within seven months of launch the salary tool was placed behind a paywall, creating a new paid subscription tier for Cord and turning a research-driven product into a revenue stream.',
				stats: [
					{ value: '↑ W1', label: 'Active users up in launch week' },
					{ value: '↑', label: 'Significant reactivation lift' },
					{ value: '7mo', label: 'Launch to monetisation' },
					{ value: 'Paid', label: 'Subscription tier' }
				]
			}
		],
		quote:
			'Not executing briefs. Identifying where the product could go, and building the case to take it there.'
	},
	{
		slug: 'indie-campers',
		no: '02',
		title: 'Indie Campers',
		subtitle: 'Owning design end to end',
		hook: 'Rebuilding design at a global marketplace: 850,000 customers, 20+ countries, zero design culture when I arrived.',
		role: 'Lead Product Designer',
		year: '2024–',
		yearRange: '2024–Present',
		heroImage: {
			ratio: '21:9',
			description:
				'Strong, cinematic hero. Best option: brand photography from the depot or a road-trip context (the campervan as a product). Alternative: a wide composite of redesigned booking-funnel screens. Avoid a generic logo or screenshot grid.'
		},
		meta: [
			{ label: 'Company', value: 'Indie Campers' },
			{ label: 'Stage', value: 'Series B' },
			{ label: 'Role', value: 'First designer in years, hired second' },
			{ label: 'Scope', value: 'Product · System · Brand · Creative direction' },
			{ label: 'Scale', value: '850k+ customers · 5M+ annual visitors' },
			{ label: 'Live', value: 'indiecampers.com', href: 'https://indiecampers.com' }
		],
		sections: [
			{
				eyebrow: 'Context · The starting point',
				heading: 'A global product that had outgrown its foundations',
				body: "The product had been built over a decade without a designer. Figma files were cluttered. A 10-year-old frontend meant shipping anything was painfully slow. Design wasn't part of the conversation at all.",
				images: [
					{
						ratio: '16:9',
						description:
							'"Before" state. A screenshot of the legacy product (search results or checkout step) at decent resolution, or a captured Figma file showing the chaos before the system. Optional: a faded/desaturated treatment to mark it as the "before".',
						caption: 'Example: legacy search results screen, captured before the redesign began.'
					}
				],
				stats: [
					{ value: '850k+', label: 'Total customers to date' },
					{ value: '5M+', label: 'Annual website visitors' },
					{ value: '20+', label: 'Countries' }
				],
				callout: {
					label: 'The brief',
					body: 'Own design at all fronts. Have an impact from day one. In e-commerce, you are never closer to the user than when you can see them convert, or not.'
				}
			},
			{
				eyebrow: 'Track 1 · Building the practice',
				heading: 'From no design culture to a functioning practice',
				body: 'Introduced user research, design rituals, and a shared process, while influencing product strategy directly with the CTO/CPO.',
				items: [
					{
						title: 'Hired and onboarded a designer',
						body: 'Built the team from one to two, with a system and process ready for them to step into.'
					},
					{
						title: 'Introduced user research',
						body: 'Brought research into a team that had been building without it.'
					},
					{
						title: 'Design process and rituals',
						body: 'Reviews, crits, handoff. A shared way of working where there was none.'
					},
					{
						title: 'Product strategy influence',
						body: 'Working with CTO/CPO so design shapes prioritisation, not just execution.'
					}
				]
			},
			{
				eyebrow: 'Track 2 · The design system',
				heading: 'Built from scratch on a new stack, adopted in three to six months',
				body: 'Advocated for and helped drive the migration to React. Built the design system in parallel: Shadcn as a base, adapted to the Indie Campers brand, on a Tailwind foundation. Tokens map cleanly between Figma and code. I customised Shadcn primitives directly in the codebase and opened PRs alongside engineers to ship system pieces without handoff.',
				images: [
					{
						ratio: '16:9',
						description:
							'Design system overview. Best: a Storybook screenshot showing the component grid, OR a Figma library page showing typography and tokens, OR a side-by-side of Figma component plus the rendered React version.',
						caption: 'Example: Storybook / Figma library overview of the new system.'
					}
				],
				items: [
					{ title: 'React + Tailwind + Shadcn', body: 'A modern stack, adapted to brand, owned end to end.' },
					{ title: 'Typed token pipeline', body: 'One source mapping cleanly from Figma to code.' },
					{ title: 'PRs alongside engineers', body: 'Shipping system pieces in code, not via handoff.' },
					{ title: 'AI-assisted workflows', body: 'Compressing component build cycles from quarters to weeks.' }
				],
				callout: {
					label: 'Why this mattered',
					body: "At 5M annual visitors across 20+ countries, inconsistency isn't aesthetic. It's a conversion problem. A design system at this scale is about making the product trustworthy enough that a first-time visitor anywhere books with confidence."
				}
			},
			{
				eyebrow: 'Track 3 · The product',
				heading: 'The full booking funnel, redesigned end to end',
				body: 'Owned the complete redesign of every step from first search to confirmed booking: the highest-revenue surface in the product. Search widget, search, results, offer, checkout, success.',
				images: [
					{
						ratio: '16:9',
						description:
							'Booking funnel hero. Best option: a "before / after" composite showing one or two key steps (results page, checkout). Alternative: a single full-screen mockup of the new results page.',
						caption: 'Example: side-by-side comparison of legacy vs redesigned checkout.'
					}
				],
				reflection: {
					label: 'An honest reflection',
					body: "The checkout didn't bring out the best in us as a team. Timing, underestimations, and how we managed deliverables had a real impact on the final result. The outcome is my responsibility too. This taught me to surface risks earlier and push harder for alignment before work begins."
				}
			},
			{
				eyebrow: 'Track 4 · Brand and visual language',
				heading: 'The most senior creative voice across product, brand, and marketing',
				body: "Beyond product design, I'm the de facto creative director at Indie Campers: the most senior design presence, and the person all visual language decisions flow through.",
				items: [
					{
						title: 'Global depot posters',
						body: 'New customer journey signage across global depots. Complex dimensions, tight timelines, multiple markets.'
					},
					{
						title: 'Signage initiative',
						body: 'Q4 signage project end-to-end, including large-format print across multiple countries.'
					},
					{
						title: 'Photography direction',
						body: 'Full photography overhaul: audit, creative brief, photographer sourcing, tracking infrastructure.'
					},
					{
						title: 'Visual language system',
						body: 'Owning consistency and evolution of the visual identity across every touchpoint.'
					}
				],
				images: [
					{
						ratio: '3:2',
						description:
							'Depot signage in situ. A photograph of the printed customer journey signage at a real depot. If you have multiple markets, this is the strongest piece to lead with.',
						caption: 'Example: depot wayfinding in Lisbon or another market.'
					},
					{
						ratio: '1:1',
						description:
							'Photography overhaul: a 3- or 4-image gallery showing the new campervan / lifestyle photography you commissioned. Square crops sit nicely in a row.'
					},
					{
						ratio: '1:1',
						description: 'Second photography overhaul image (gallery row continues).'
					},
					{
						ratio: '1:1',
						description: 'Third photography overhaul image (gallery row continues).'
					}
				]
			}
		]
	},
	{
		slug: 'tenzo',
		no: '03',
		title: 'Tenzo',
		subtitle: 'Building design from the ground up, at scale',
		hook: "Most founding-design jobs are a blank canvas. This one was a live product, hundreds of paying customers, and a CTO who didn't think design was the point. I changed his mind.",
		role: 'Senior Product Designer',
		year: '2023–24',
		yearRange: '2023–2024',
		heroImage: {
			ratio: '16:9',
			description:
				'Tenzo product screenshot. Best: the main analytics dashboard at full quality. Alternative: a marketing-style hero composite showing the product in a restaurant operations context.'
		},
		meta: [
			{ label: 'Company', value: 'Tenzo' },
			{ label: 'Stage', value: 'Series A' },
			{ label: 'Role', value: 'First and only designer, hired second' },
			{ label: 'Customers', value: 'IHG · PokéHouse · Time Out Market · MJMK' },
			{ label: 'Partnerships', value: '85 integrations: Oracle, Lightspeed, Square, Shopify, Clover' }
		],
		sections: [
			{
				eyebrow: 'Context · Why this was different',
				heading: 'Not a blank canvas. A live product under real commercial pressure',
				body: "I'd been a founding designer before, twice, at seed-stage startups. Tenzo was different. Series A, hundreds of paying customers, enterprise accounts, and 85 major tech partnerships. Every design decision had to work for users already depending on the product daily.",
				stats: [
					{ value: 'Hundreds', label: 'Paying customers on day one' },
					{ value: '85', label: 'Major tech partnerships' },
					{ value: 'Series A', label: 'Serious expectations' }
				]
			},
			{
				eyebrow: 'Track 1 · Building the culture',
				heading: 'Convincing a technical organisation that design is more than aesthetics',
				body: 'The biggest obstacle was the CTO. I ran workshops to define design principles with the CTO in the room, introduced usability metrics, and brought real restaurant operators in front of the team. By the time I hired a second designer, there was a real practice to onboard into.',
				images: [
					{
						ratio: '4:3',
						description:
							'A photo of the design-principles workshop, OR a captured slide/whiteboard from it, OR a research session with a restaurant operator. Anything that shows the team and process, not just a UI.',
						caption: 'Example: design-principles workshop with engineering present.'
					}
				],
				items: [
					{
						title: "Involve, don't present",
						body: 'Brought engineers and CTO into workshops. People defend the decisions they help shape.'
					},
					{
						title: 'Show value fast',
						body: 'Early, visible wins built credibility before any of the bigger asks landed in the room.'
					},
					{
						title: 'Speak their language',
						body: 'Framed design in terms engineering cared about: speed, fewer reworks, less support load.'
					},
					{
						title: 'Bring the customer in',
						body: "Once engineers saw users struggle with what they'd built, the UX conversation changed."
					}
				]
			},
			{
				eyebrow: 'Track 2 · The design system',
				heading: 'Zero to production in three to six months',
				body: 'Built a complete design system from scratch: component library, tokens, shared Figma workspace, dev handoff, documentation. Adopted across the full product. At Series A, with 85 integrations and enterprise customers under contract, consistency was a commercial requirement, not an aesthetic one.',
				images: [
					{
						ratio: '16:9',
						description:
							'Tenzo design system reference. Best: a Figma library overview of components/typography, OR a screenshot of the documentation page, OR a "before vs after" of a representative screen.',
						caption: 'Example: Figma library overview of the Tenzo system.'
					}
				]
			},
			{
				eyebrow: 'Track 3 · The features',
				heading: 'Two features that changed how users and teams worked',
				body: 'Dashboard Creator gave restaurant operators self-serve control over their analytics, eliminating a backlog of manual internal data requests. Outbound gave users self-serve recurring email reporting, eliminating an entire category of developer support tickets.',
				images: [
					{
						ratio: '16:9',
						description:
							'Dashboard Creator screen. Best: the drag-and-drop builder mid-interaction, OR a finished custom dashboard. Show the self-serve nature clearly.',
						caption: 'Example: the Dashboard Creator builder, mid-edit.'
					},
					{
						ratio: '16:9',
						description:
							'Outbound feature screen. Best: the recurring-email setup view, OR the dashboard listing scheduled reports.',
						caption: 'Example: Outbound recurring-reports configuration.'
					}
				],
				items: [
					{
						title: 'Dashboard Creator, for users',
						body: 'Full self-serve analytics. No more waiting on the internal data team.'
					},
					{
						title: 'Outbound, for the business',
						body: 'CS team freed. Developer time no longer diverted to a category design could solve.'
					}
				],
				callout: {
					label: 'The process behind Outbound',
					body: 'I started with stakeholder interviews. The CS team first, because they were closest to the pain. Then the PM and the engineers who had touched the feature before, to understand constraints and history. From there: user flow, a scope-alignment session, multiple prototype rounds, and a three-part implementation that landed across separate areas of the product.'
				}
			}
		],
		quote:
			'Earning the right to have design at the table, and making sure we used that seat well.'
	}
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

export const getAdjacent = (slug: string) => {
	const i = projects.findIndex((p) => p.slug === slug);
	return {
		prev: i > 0 ? projects[i - 1] : null,
		next: i < projects.length - 1 ? projects[i + 1] : null
	};
};
