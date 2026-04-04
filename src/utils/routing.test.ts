import test from 'node:test';
import assert from 'node:assert';
import { mapEntriesToStaticPaths } from './routing.ts';

test('mapEntriesToStaticPaths correctly maps entries to static paths', () => {
	const mockEntries = [
		{ id: '1', data: { name: 'Entry 1' } },
		{ id: '2', data: { name: 'Entry 2' } },
	];

	const result = mapEntriesToStaticPaths(mockEntries);

	assert.strictEqual(result.length, 2);
	assert.strictEqual(result[0].params.slug, '1');
	assert.deepStrictEqual(result[0].props, mockEntries[0]);
	assert.strictEqual(result[1].params.slug, '2');
	assert.deepStrictEqual(result[1].props, mockEntries[1]);
});

test('mapEntriesToStaticPaths handles empty array', () => {
	const result = mapEntriesToStaticPaths([]);
	assert.strictEqual(result.length, 0);
});
