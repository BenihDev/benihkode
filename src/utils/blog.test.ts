import test from 'node:test';
import assert from 'node:assert';
import { mapPostsToStaticPaths } from './blog.ts';

test('mapPostsToStaticPaths correctly maps blog posts to static paths', () => {
	const mockPosts = [
		{
			id: 'post-1',
			data: {
				title: 'Post 1',
				description: 'Description 1',
				pubDate: new Date('2024-01-01'),
				tags: ['tag1', 'tag2'],
			},
		},
		{
			id: 'post-2',
			data: {
				title: 'Post 2',
				description: 'Description 2',
				pubDate: new Date('2024-01-02'),
			},
		},
	];

	const result = mapPostsToStaticPaths(mockPosts);

	assert.strictEqual(result.length, 2);

	// Check first item
	assert.strictEqual(result[0].params.slug, 'post-1');
	assert.deepStrictEqual(result[0].props, mockPosts[0]);

	// Check second item
	assert.strictEqual(result[1].params.slug, 'post-2');
	assert.deepStrictEqual(result[1].props, mockPosts[1]);
});

test('mapPostsToStaticPaths handles empty array', () => {
	const result = mapPostsToStaticPaths([]);
	assert.strictEqual(result.length, 0);
});
