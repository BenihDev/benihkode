/**
 * JSON-LD structured data helpers (BEN-4).
 *
 * Centralizes every schema.org payload the site emits so @id references
 * stay consistent across pages (Organization ↔ WebSite ↔ WebPage ↔ BreadcrumbList).
 *
 * Canonical URL note: Vercel redirects the apex (benihkode.web.id) to
 * www.benihkode.web.id, so every URL in the graph uses the www origin to
 * match what Google actually indexes.
 */

export const SITE_URL = 'https://www.benihkode.web.id';

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

export interface Crumb {
	label: string;
	path?: string;
}

export interface ArticleSchemaInput {
	title: string;
	description: string;
	pubDate: Date;
	updatedDate?: Date;
	tags?: string[];
	slug: string;
}

export function organizationSchema() {
	return {
		'@type': 'Organization',
		'@id': ORG_ID,
		name: 'BenihKode',
		description:
			'A developer\u2019s garden: where product ideas are planted, shipped projects are harvested, and the whole build journey is documented.',
		url: SITE_URL,
		email: 'hello@benihkode.web.id',
		logo: {
			'@type': 'ImageObject',
			url: `${SITE_URL}/favicon.svg`,
		},
		sameAs: [
			'https://github.com/BenihDev',
			'https://twitter.com/benihkode',
			'https://linkedin.com/company/benihkode',
		],
	};
}

export function websiteSchema() {
	return {
		'@type': 'WebSite',
		'@id': WEBSITE_ID,
		url: SITE_URL,
		name: 'BenihKode — Seed of Code',
		description:
			'Where ideas are planted, code is cultivated, and growth is documented. A developer\u2019s journey from seed to harvest.',
		publisher: { '@id': ORG_ID },
	};
}

export function webpageSchema(url: string, title: string, description: string) {
	return {
		'@type': 'WebPage',
		'@id': `${url}#webpage`,
		url,
		name: title,
		description,
		isPartOf: { '@id': WEBSITE_ID },
		about: { '@id': ORG_ID },
	};
}

/**
 * BreadcrumbList for the Ideas → Portfolio → Journal funnel.
 * Each crumb matches the site's real section order (01 Ideas, 02 Portfolio, 03 Journal),
 * not the header nav order — the graph mirrors how content matures on this site.
 */
export function breadcrumbSchema(crumbs: Crumb[], pageUrl: string) {
	const items = [{ label: 'Home', path: '/' }, ...crumbs];
	return {
		'@type': 'BreadcrumbList',
		'@id': `${pageUrl}#breadcrumb`,
		itemListElement: items.map((crumb, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: crumb.label,
			...(crumb.path ? { item: new URL(crumb.path, SITE_URL).href } : {}),
		})),
	};
}

/**
 * Article (BlogPosting) for Journal posts. `mainEntityOfPage` ties the
 * article to its WebPage node; keywords carry the post's tags.
 */
export function articleSchema(post: ArticleSchemaInput) {
	const url = `${SITE_URL}/blog/${post.slug}/`;
	return {
		'@type': 'BlogPosting',
		'@id': `${url}#article`,
		headline: post.title,
		description: post.description,
		url,
		image: `${SITE_URL}/og-default.png`,
		datePublished: post.pubDate.toISOString(),
		...(post.updatedDate ? { dateModified: post.updatedDate.toISOString() } : {}),
		author: {
			'@type': 'Person',
			name: 'BenihKode',
			url: SITE_URL,
		},
		publisher: { '@id': ORG_ID },
		mainEntityOfPage: { '@id': `${url}#webpage` },
		keywords: post.tags?.length ? post.tags.join(', ') : undefined,
	};
}
