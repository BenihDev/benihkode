/**
 * ⚡ Bolt Optimization: Pure sorting functions for blog, projects, and ideas.
 * Extracted to a separate file to enable unit testing without 'astro:content' dependencies.
 */

export const blogSorter = (a: any, b: any) =>
	b.data.pubDate.valueOf() - a.data.pubDate.valueOf();

/**
 * Explicit tie-break for entries sharing an `order`: title ascending (A→Z),
 * case-insensitive. Titles are lowercased and compared by code unit (not
 * locale collation) so the order does not depend on the build machine's
 * locale; the raw title only separates case-only variants so they still have
 * a deterministic order.
 */
const compareTitles = (a: any, b: any) => {
	const titleA = a.data.title ?? '';
	const titleB = b.data.title ?? '';
	const lowerA = titleA.toLowerCase();
	const lowerB = titleB.toLowerCase();
	if (lowerA === lowerB) {
		if (titleA === titleB) return 0;
		return titleA < titleB ? -1 : 1;
	}
	return lowerA < lowerB ? -1 : 1;
};

export const orderSorter = (a: any, b: any) =>
	(a.data.order ?? 0) - (b.data.order ?? 0) || compareTitles(a, b);
