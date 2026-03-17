import test from 'node:test';
import assert from 'node:assert';
import { mapIdeasToStaticPaths } from './ideas.ts';

test('mapIdeasToStaticPaths correctly maps ideas to static paths', () => {
	const mockIdeas = [
		{
			id: 'idea-1',
			data: {
				title: 'Idea 1',
				description: 'Description 1',
				status: 'idea',
				order: 1,
			},
		},
		{
			id: 'idea-2',
			data: {
				title: 'Idea 2',
				description: 'Description 2',
				status: 'in-progress',
				meta: 'Dec 2024',
			},
		},
	];

	const result = mapIdeasToStaticPaths(mockIdeas);

	assert.strictEqual(result.length, 2);

	// Check first item
	assert.strictEqual(result[0].params.slug, 'idea-1');
	assert.deepStrictEqual(result[0].props, mockIdeas[0]);

	// Check second item
	assert.strictEqual(result[1].params.slug, 'idea-2');
	assert.deepStrictEqual(result[1].props, mockIdeas[1]);
});

test('mapIdeasToStaticPaths handles empty array', () => {
	const result = mapIdeasToStaticPaths([]);
	assert.strictEqual(result.length, 0);
});
