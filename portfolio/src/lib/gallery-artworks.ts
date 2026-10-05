// Approved Renaissance selection. Source/reuse statements checked 2026-10-05.
// All three are AI-generated reinterpretations of public-domain paintings,
// credited as such; each label links to the original reproduction.
// The UI applies reversible cover crops and a dark overlay for legibility.
const publicDomain = {
	license: 'Public domain (PD-Art)',
	licenseUrl: 'https://creativecommons.org/publicdomain/mark/1.0/',
	changes: 'Resized to 2560px wide and converted to WebP. Displayed with responsive cropping and a dark readability overlay.'
};

const layeredDisplay = `${publicDomain.changes} Tone graded to sit with the other gallery images: 17% more contrast, slightly darker, 15% less saturation, applied equally to every depth plate. Optional parallax separates the original reproduction into three rigid planes, preserving the painting's own lighting without added silhouette shadows. AI-assisted segmentation and reconstructed hidden backgrounds fill the small areas revealed between planes. Original source files are unchanged; reduced-motion mode shows the original still.`;

const reimagined = (layers: string) => `Not the original reproduction: an AI-generated reinterpretation of the painting’s composition, made with ChatGPT image generation as three separate layers (${layers}). Optional parallax moves the layers independently with soft shadows between them; reduced-motion mode shows the flattened image. Displayed with responsive cropping and a dark readability overlay.`;

export const galleryArtworks = {
	cord: {
		...publicDomain,
		license: 'Original painting: public domain (PD-Art)',
		changes: reimagined('architecture, Plato, Aristotle and the upper group, the foreground groups'),
		image: '/images/exhibition/cord-school-of-athens-reimagined.webp',
		position: '50% 80%',
		mobilePosition: '50% 50%',
		title: 'The School of Athens',
		artist: 'Raphael',
		year: '1509–1511',
		collection: 'Vatican Museums, Vatican City',
		connection: 'Raphael brings great minds together to exchange ideas. For Cord, this becomes a metaphor for connecting talent with opportunity: helping people find a place where their knowledge can flourish.',
		source: 'https://commons.wikimedia.org/wiki/File:Raphael_School_of_Athens.jpg',
		context: 'https://www.museivaticani.va/content/museivaticani/en/collezioni/musei/stanze-di-raffaello/stanza-della-segnatura/scuola-di-atene.html',
		credit: 'AI-generated reinterpretation after Raphael. The linked original is a public-domain reproduction via Wikimedia Commons.'
	},
	'indie-campers': {
		...publicDomain,
		license: 'Original painting: public domain (PD-Art)',
		changes: reimagined('landscape, side figures, Venus on her shell'),
		image: '/images/exhibition/indie-birth-of-venus-reimagined.webp',
		position: '50% 15%',
		mobilePosition: '59% 50%',
		title: 'The Birth of Venus',
		artist: 'Sandro Botticelli',
		year: 'c. 1485',
		collection: 'Uffizi Galleries, Florence',
		connection: 'Wind carries Venus towards a new shore. For Indie Campers, that sense of arrival echoes the freedom of a road trip: leaving the familiar, discovering somewhere new, and travelling at your own pace.',
		source: 'https://commons.wikimedia.org/wiki/File:Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg',
		context: 'https://www.uffizi.it/en/artworks/birth-of-venus',
		credit: 'AI-generated reinterpretation after Botticelli. The linked original is the Google Art Project reproduction via Wikimedia Commons (levels-adjusted version by Dcoetzee).'
	},
	tenzo: {
		...publicDomain,
		license: 'Original painting: public domain (PD-Art)',
		changes: reimagined('architecture and sky, the upper terrace, the banquet with its guests and musicians'),
		image: '/images/exhibition/tenzo-wedding-at-cana-reimagined.webp',
		position: '50% 68%',
		mobilePosition: '57% 50%',
		title: 'The Wedding Feast at Cana',
		artist: 'Paolo Veronese',
		year: '1562–1563',
		collection: 'Musée du Louvre, Paris',
		connection: 'Behind Veronese’s magnificent feast is a world of preparation, service, and coordination. Tenzo supports that same world of hospitality, helping restaurant teams turn complex operations into a better experience for their guests.',
		source: 'https://commons.wikimedia.org/wiki/File:Paolo_Veronese_008.jpg',
		context: 'https://collections.louvre.fr/en/ark:/53355/cl010064382',
		credit: 'AI-generated reinterpretation after Veronese. The linked original is a public-domain reproduction via Wikimedia Commons; photographer unknown. The source metadata credits Gallerix.ru.'
	}
};
