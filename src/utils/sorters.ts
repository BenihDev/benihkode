/**
 * ⚡ Bolt Optimization: Pure sorting functions for blog, projects, and ideas.
 * Extracted to a separate file to enable unit testing without 'astro:content' dependencies.
 */

export const blogSorter = (a: any, b: any) =>
	b.data.pubDate.valueOf() - a.data.pubDate.valueOf();

/**
 * Explicit tie-break for entries sharing an `order`: title ascending (A→Z).
 * Titles are compared by code unit rather than locale collation so the order
 * does not depend on the build machine's locale.
 */
const compareTitles = (a: any, b: any) => {
	const titleA = a.data.title ?? '';
	const titleB = b.data.title ?? '';
	if (titleA === titleB) return 0;
	return titleA < titleB ? -1 : 1;
};

export const orderSorter = (a: any, b: any) =>
	(a.data.order ?? 0) - (b.data.order ?? 0) || compareTitles(a, b);
