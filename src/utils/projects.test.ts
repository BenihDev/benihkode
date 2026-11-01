import test from 'node:test';
import assert from 'node:assert';
import { getPrivacyPolicyHref, getPrivacyPolicyStaticPaths, projectLandingHref } from './projects.ts';

test('projectLandingHref serves apps at /apps/<slug>', () => {
	const project = {
		id: 'smartstartup',
		data: { category: 'app' as const },
	};

	assert.strictEqual(projectLandingHref(project), '/apps/smartstartup');
});

test('projectLandingHref serves tools at /tools/<slug>', () => {
	const project = {
		id: 'gitprgen',
		data: { category: 'tool' as const },
	};

	assert.strictEqual(projectLandingHref(project), '/tools/gitprgen');
});

test('getPrivacyPolicyStaticPaths returns distributed apps and preserves props', () => {
	const apps = [
		{
			id: 'echochess',
			data: {
				distributed: true,
				title: 'EchoChess',
				emoji: '♞',
			},
		},
		{
			id: 'chatmini',
			data: {
				distributed: false,
				title: 'ChatMini',
			},
		},
		{
			id: 'taskmaster-cli',
			data: {
				title: 'TaskMaster CLI',
			},
		},
		{
			id: 'weathernow',
			data: {
				distributed: true,
				techStack: ['React', 'ML'],
			},
		},
	];

	const result = getPrivacyPolicyStaticPaths(apps);

	assert.strictEqual(result.length, 2);
	assert.strictEqual(result[0].params.slug, 'echochess');
	assert.deepStrictEqual(result[0].props, apps[0]);
	assert.strictEqual(result[1].params.slug, 'weathernow');
	assert.deepStrictEqual(result[1].props, apps[3]);
});

test('getPrivacyPolicyStaticPaths excludes apps with a hand-written privacy page', () => {
	const apps = [
		{
			id: 'echochess',
			data: { distributed: true },
		},
		{
			id: 'weathernow',
			data: { distributed: true },
		},
	];

	// The escape hatch is file presence: a hand-written page at the same URL
	// wins, so the generated route must not emit a second page there.
	const result = getPrivacyPolicyStaticPaths(apps, new Set(['echochess']));

	assert.deepStrictEqual(result.map((path) => path.params.slug), ['weathernow']);
});

test('getPrivacyPolicyStaticPaths handles empty input', () => {
	assert.strictEqual(getPrivacyPolicyStaticPaths([]).length, 0);
	assert.strictEqual(getPrivacyPolicyStaticPaths([], new Set(['echochess'])).length, 0);
});

test('getPrivacyPolicyHref returns the canonical /apps privacy URL', () => {
	// Hand-written and generated policies share one URL under /apps, so the
	// link does not depend on which kind of page is published.
	assert.strictEqual(getPrivacyPolicyHref({ id: 'echochess', data: { distributed: true } }), '/apps/echochess/privacy');
});
