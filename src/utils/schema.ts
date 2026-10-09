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
const AUTHOR_ID = `${SITE_URL}/about/#person`;

export { ORG_ID, WEBSITE_ID, AUTHOR_ID };

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

/**
 * Author entity (Person) for the BenihKode byline (BEN-7).
 *
 * GEO rationale: answer engines resolve entities, not just pages. One stable
 * `@id` for the author, linked from every tool/project byline and from the
 * Organization node, keeps "BenihKode" a single resolvable entity with
 * consistent `sameAs` profiles across the site.
 */
export function authorSchema() {
	return {
		'@type': 'Person',
		'@id': AUTHOR_ID,
		name: 'BenihKode',
		alternateName: 'Seed of Code',
		url: `${SITE_URL}/about/`,
		description:
			'BenihKode is a solo, multi-practice developer studio that builds small, opinionated developer tools (CLIs, npm packages, browser extensions, and mobile apps) and documents the engineering behind them.',
		jobTitle: 'Software Developer',
		knowsAbout: [
			'developer tools',
			'command-line interfaces',
			'npm packages',
			'TypeScript',
			'Node.js',
			'software engineering',
		],
		sameAs: [
			'https://github.com/BenihDev',
			'https://twitter.com/benihkode',
			'https://linkedin.com/company/benihkode',
		],
	};
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
		// The same person owns the org on a solo studio — link them (BEN-7).
		founder: { '@id': AUTHOR_ID },
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
		author: { '@id': AUTHOR_ID },
		publisher: { '@id': ORG_ID },
		mainEntityOfPage: { '@id': `${url}#webpage` },
		keywords: post.tags?.length ? post.tags.join(', ') : undefined,
	};
}
