import test from 'node:test';
import assert from 'node:assert';
import { getPrivacyPolicyStaticPaths } from './projects.ts';

test('getPrivacyPolicyStaticPaths returns projects with hasPrivacyPolicy: true', () => {
	const mockProjects = [
		{
			id: 'project-1',
			data: {
				hasPrivacyPolicy: true,
			},
		},
		{
			id: 'project-2',
			data: {
				hasPrivacyPolicy: false,
			},
		},
		{
			id: 'project-3',
			data: {},
		},
		{
			id: 'project-4',
			data: {
				hasPrivacyPolicy: true,
			},
		},
	];

	const result = getPrivacyPolicyStaticPaths(mockProjects);

	assert.strictEqual(result.length, 2);

	// Check first item
	assert.strictEqual(result[0].params.slug, 'project-1');
	assert.deepStrictEqual(result[0].props, mockProjects[0]);

	// Check second item
	assert.strictEqual(result[1].params.slug, 'project-4');
	assert.deepStrictEqual(result[1].props, mockProjects[3]);
});

test('getPrivacyPolicyStaticPaths handles empty array', () => {
	const result = getPrivacyPolicyStaticPaths([]);
	assert.strictEqual(result.length, 0);
});
