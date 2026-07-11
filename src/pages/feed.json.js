import { getCollection } from 'astro:content';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';

export async function GET(context) {
	const siteUrl = (context.site?.toString() || 'https://benihkode.web.id').replace(/\/$/, '');
	const posts = (await getCollection('blog'))
		.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

	const feed = {
		version: 'https://jsonfeed.org/version/1.1',
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		home_page_url: siteUrl,
		feed_url: `${siteUrl}/feed.json`,
		items: posts.map((post) => ({
			id: `${siteUrl}/blog/${post.id}/`,
			url: `${siteUrl}/blog/${post.id}/`,
			title: post.data.title,
			content_html: post.body || '',
			summary: post.data.description,
			date_published: post.data.pubDate.toISOString(),
			date_modified: post.data.updatedDate?.toISOString() || post.data.pubDate.toISOString(),
			tags: post.data.tags || [],
		})),
	};

	return new Response(JSON.stringify(feed, null, 2), {
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
		},
	});
}
