// Approved Renaissance selection. Source/reuse statements checked 2026-10-05.
// Original reproductions are resized and encoded as WebP, not AI-generated.
// The UI applies reversible cover crops and a dark overlay for legibility.
const publicDomain = {
	license: 'Public domain (PD-Art)',
	licenseUrl: 'https://creativecommons.org/publicdomain/mark/1.0/',
	changes: 'Resized to 2560px wide and converted to WebP. Displayed with responsive cropping and a dark readability overlay; no additional colour grading.'
};

const layeredDisplay = `${publicDomain.changes} Optional parallax separates the original reproduction into three rigid planes, with soft simulated shadows behind the foreground and middle cutouts. AI-assisted segmentation and reconstructed hidden backgrounds fill the small areas revealed between planes. Original source files are unchanged; reduced-motion mode shows the original still.`;

export const galleryArtworks = {
	cord: {
		...publicDomain,
		changes: layeredDisplay,
		image: '/images/exhibition/cord-school-of-athens.webp',
		position: '50% 60%',
		mobilePosition: '50% 50%',
		title: 'The School of Athens',
		artist: 'Raphael',
		year: '1509–1511',
		collection: 'Vatican Museums, Vatican City',
		connection: 'Raphael brings great minds together to exchange ideas. For Cord, this becomes a metaphor for connecting talent with opportunity: helping people find a place where their knowledge can flourish.',
		source: 'https://commons.wikimedia.org/wiki/File:Raphael_School_of_Athens.jpg',
		context: 'https://www.museivaticani.va/content/museivaticani/en/collezioni/musei/stanze-di-raffaello/stanza-della-segnatura/scuola-di-atene.html',
		credit: 'Public-domain reproduction via Wikimedia Commons.'
	},
	'indie-campers': {
		...publicDomain,
		changes: layeredDisplay,
		image: '/images/exhibition/indie-birth-of-venus.webp',
		position: '50% 48%',
		mobilePosition: '59% 50%',
		title: 'The Birth of Venus',
		artist: 'Sandro Botticelli',
		year: 'c. 1485',
		collection: 'Uffizi Galleries, Florence',
		connection: 'Wind carries Venus towards a new shore. For Indie Campers, that sense of arrival echoes the freedom of a road trip: leaving the familiar, discovering somewhere new, and travelling at your own pace.',
		source: 'https://commons.wikimedia.org/wiki/File:Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg',
		context: 'https://www.uffizi.it/en/artworks/birth-of-venus',
		credit: 'Google Art Project reproduction via Wikimedia Commons; levels-adjusted source version by Dcoetzee.'
	},
	tenzo: {
		...publicDomain,
		changes: layeredDisplay,
		image: '/images/exhibition/tenzo-wedding-at-cana.webp',
		position: '50% 57%',
		mobilePosition: '57% 50%',
		title: 'The Wedding Feast at Cana',
		artist: 'Paolo Veronese',
		year: '1562–1563',
		collection: 'Musée du Louvre, Paris',
		connection: 'Behind Veronese’s magnificent feast is a world of preparation, service, and coordination. Tenzo supports that same world of hospitality, helping restaurant teams turn complex operations into a better experience for their guests.',
		source: 'https://commons.wikimedia.org/wiki/File:Paolo_Veronese_008.jpg',
		context: 'https://collections.louvre.fr/en/ark:/53355/cl010064382',
		credit: 'Public-domain reproduction via Wikimedia Commons; photographer unknown. The source metadata credits Gallerix.ru.'
	}
};
