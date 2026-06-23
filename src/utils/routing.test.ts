import test from 'node:test';
import assert from 'node:assert';
import { mapEntriesToStaticPaths } from './routing.ts';

test('mapEntriesToStaticPaths correctly maps collection entries to static paths', () => {
	const mockEntries = [
		{
			id: 'item-1',
			data: {
				title: 'Item 1',
			},
		},
		{
			id: 'item-2',
			data: {
				title: 'Item 2',
			},
		},
	];

	const result = mapEntriesToStaticPaths(mockEntries);

	assert.strictEqual(result.length, 2);

	// Check first item
	assert.strictEqual(result[0].params.slug, 'item-1');
	assert.deepStrictEqual(result[0].props, mockEntries[0]);

	// Check second item
	assert.strictEqual(result[1].params.slug, 'item-2');
	assert.deepStrictEqual(result[1].props, mockEntries[1]);
});

test('mapEntriesToStaticPaths handles empty array', () => {
	const result = mapEntriesToStaticPaths([]);
	assert.strictEqual(result.length, 0);
});
