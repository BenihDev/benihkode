import test from 'node:test';
import assert from 'node:assert';
import { blogSorter, orderSorter } from './sorters.ts';

test('blogSorter correctly sorts by date descending', () => {
	const mockPosts = [
		{ data: { pubDate: new Date('2024-01-01') } },
		{ data: { pubDate: new Date('2024-01-03') } },
		{ data: { pubDate: new Date('2024-01-02') } },
	];

	const sorted = [...mockPosts].sort(blogSorter);

	assert.strictEqual(sorted[0].data.pubDate.getTime(), new Date('2024-01-03').getTime());
	assert.strictEqual(sorted[1].data.pubDate.getTime(), new Date('2024-01-02').getTime());
	assert.strictEqual(sorted[2].data.pubDate.getTime(), new Date('2024-01-01').getTime());
});

test('orderSorter correctly sorts by order ascending', () => {
	const mockItems = [
		{ data: { order: 3 } },
		{ data: { order: 1 } },
		{ data: { order: 2 } },
	];

	const sorted = [...mockItems].sort(orderSorter);

	assert.strictEqual(sorted[0].data.order, 1);
	assert.strictEqual(sorted[1].data.order, 2);
	assert.strictEqual(sorted[2].data.order, 3);
});

test('orderSorter handles missing order by defaulting to 0', () => {
	const mockItems = [
		{ data: { order: 3 } },
		{ data: {} },
		{ data: { order: 1 } },
	];

	const sorted = [...mockItems].sort(orderSorter);

	assert.strictEqual(sorted[0].data.order, undefined);
	assert.strictEqual(sorted[1].data.order, 1);
	assert.strictEqual(sorted[2].data.order, 3);
});
