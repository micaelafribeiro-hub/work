import { galleryArtworks } from '$lib/gallery-artworks';

// The exhibition order, shared by the home gallery and the project pages.
export const collection = [
	{ slug: 'indie-campers', title: 'Indie Campers', category: 'Product & creative direction', caption: 'Designing the freedom to explore.', frame: 'black', artwork: galleryArtworks['indie-campers'] },
	{ slug: 'cord', title: 'Cord', category: 'Research & product design', caption: 'A new perspective on career decisions.', frame: 'black', artwork: galleryArtworks.cord },
	{ slug: 'tenzo', title: 'Tenzo', category: 'Product & systems design', caption: 'Clarity behind every service.', frame: 'black', artwork: galleryArtworks.tenzo }
];

export type CollectionItem = (typeof collection)[number];

export const pieceNumber = (i: number) => String(i + 1).padStart(2, '0');

// View-transition names shared by the gallery and the project pages, so the
// painting, the framed tile and the title fly between them.
export const transitionNames = (slug: string) => ({ art: `art-${slug}`, frame: `frame-${slug}`, title: `title-${slug}` });
