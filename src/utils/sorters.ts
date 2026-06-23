/**
 * ⚡ Bolt Optimization: Pure sorting functions for blog, projects, and ideas.
 * Extracted to a separate file to enable unit testing without 'astro:content' dependencies.
 */

export const blogSorter = (a: any, b: any) =>
	b.data.pubDate.valueOf() - a.data.pubDate.valueOf();

export const orderSorter = (a: any, b: any) =>
	(a.data.order ?? 0) - (b.data.order ?? 0);
