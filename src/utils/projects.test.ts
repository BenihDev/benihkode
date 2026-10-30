import test from 'node:test';
import assert from 'node:assert';
import { getPrivacyPolicyHref, getPrivacyPolicyStaticPaths } from './projects.ts';

test('getPrivacyPolicyStaticPaths returns projects with hasPrivacyPolicy: true and preserves props', () => {
	const mockProjects = [
		{
			id: 'project-1',
			data: {
				hasPrivacyPolicy: true,
				title: 'Project 1',
				emoji: '🚀',
			},
		},
		{
			id: 'project-2',
			data: {
				hasPrivacyPolicy: false,
				title: 'Project 2',
			},
		},
		{
			id: 'project-3',
			data: {
				title: 'Project 3',
			},
		},
		{
			id: 'project-4',
			data: {
				hasPrivacyPolicy: true,
				title: 'Project 4',
				techStack: ['Astro', 'TypeScript'],
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

test('getPrivacyPolicyStaticPaths skips projects that publish their own policy page', () => {
	const mockProjects = [
		{
			id: 'bespoke',
			data: {
				hasPrivacyPolicy: true,
				privacyPolicyUrl: '/legal/bespoke-privacy',
			},
		},
		{
			id: 'generated',
			data: {
				hasPrivacyPolicy: true,
			},
		},
	];

	const result = getPrivacyPolicyStaticPaths(mockProjects);

	assert.deepStrictEqual(result.map((path) => path.params.slug), ['generated']);
});

test('getPrivacyPolicyHref prefers a bespoke privacy page over the generated route', () => {
	const project = {
		id: 'echochess',
		data: {
			hasPrivacyPolicy: true,
			privacyPolicyUrl: '/legal/echochess-privacy',
		},
	};

	assert.strictEqual(getPrivacyPolicyHref(project), '/legal/echochess-privacy');
});

test('getPrivacyPolicyHref falls back to the generated privacy route', () => {
	const project = {
		id: 'smartstartup',
		data: {
			hasPrivacyPolicy: true,
		},
	};

	assert.strictEqual(getPrivacyPolicyHref(project), '/projects/smartstartup/privacy-policy');
});

test('getPrivacyPolicyStaticPaths handles empty array', () => {
	const result = getPrivacyPolicyStaticPaths([]);
	assert.strictEqual(result.length, 0);
});

test('getPrivacyPolicyStaticPaths returns empty array when no projects have privacy policy', () => {
	const mockProjects = [
		{
			id: 'project-1',
			data: {
				hasPrivacyPolicy: false,
			},
		},
		{
			id: 'project-2',
			data: {},
		},
	];

	const result = getPrivacyPolicyStaticPaths(mockProjects);
	assert.strictEqual(result.length, 0);
});
