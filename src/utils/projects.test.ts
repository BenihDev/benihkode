import test from 'node:test';
import assert from 'node:assert';
import { getPrivacyPolicyHref, getPrivacyPolicyStaticPaths, getSupportHref, getSupportStaticPaths, projectLandingHref } from './projects.ts';

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
				category: 'app' as const,
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
				category: 'app' as const,
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
			data: { category: 'app' as const, distributed: true },
		},
		{
			id: 'weathernow',
			data: { category: 'app' as const, distributed: true },
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

test('getPrivacyPolicyStaticPaths excludes a distributed entry flagged as a tool', () => {
	// Defense in depth: only Apps grow the store-facing pages, so a tool that
	// is mis-flagged distributed by mistake must not emit a policy route.
	const apps = [
		{
			id: 'misflagged-tool',
			data: { category: 'tool' as const, distributed: true },
		},
	];

	assert.deepStrictEqual(getPrivacyPolicyStaticPaths(apps), []);
});

test('getPrivacyPolicyHref returns the canonical /apps privacy URL', () => {
	// Hand-written and generated policies share one URL under /apps, so the
	// link does not depend on which kind of page is published.
	assert.strictEqual(getPrivacyPolicyHref({ id: 'echochess', data: { distributed: true } }), '/apps/echochess/privacy');
});

test('getSupportStaticPaths returns distributed apps and preserves props', () => {
	const apps = [
		{
			id: 'weathernow',
			data: {
				category: 'app' as const,
				distributed: true,
				title: 'WeatherNow',
				emoji: '🌤',
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
			id: 'pocketbudget',
			data: {
				category: 'app' as const,
				distributed: true,
				techStack: ['React Native', 'SQLite'],
			},
		},
	];

	const result = getSupportStaticPaths(apps);

	assert.strictEqual(result.length, 2);
	assert.strictEqual(result[0].params.slug, 'weathernow');
	assert.deepStrictEqual(result[0].props, apps[0]);
	assert.strictEqual(result[1].params.slug, 'pocketbudget');
	assert.deepStrictEqual(result[1].props, apps[3]);
});

test('getSupportStaticPaths excludes apps with a hand-written support page', () => {
	const apps = [
		{
			id: 'echochess',
			data: { category: 'app' as const, distributed: true },
		},
		{
			id: 'weathernow',
			data: { category: 'app' as const, distributed: true },
		},
	];

	// The escape hatch is file presence: a hand-written page at the same URL
	// wins, so the generated route must not emit a second page there.
	const result = getSupportStaticPaths(apps, new Set(['echochess']));

	assert.deepStrictEqual(result.map((path) => path.params.slug), ['weathernow']);
});

test('getSupportStaticPaths handles empty input', () => {
	assert.strictEqual(getSupportStaticPaths([]).length, 0);
	assert.strictEqual(getSupportStaticPaths([], new Set(['echochess'])).length, 0);
});

test('getSupportStaticPaths excludes a distributed entry flagged as a tool', () => {
	// Defense in depth: only Apps grow the store-facing pages, so a tool that
	// is mis-flagged distributed by mistake must not emit a support route.
	const apps = [
		{
			id: 'misflagged-tool',
			data: { category: 'tool' as const, distributed: true },
		},
	];

	assert.deepStrictEqual(getSupportStaticPaths(apps), []);
});

test('getSupportHref returns the canonical /apps support URL', () => {
	// Hand-written and generated support pages share one URL under /apps, so
	// the link does not depend on which kind of page is published.
	assert.strictEqual(getSupportHref({ id: 'echochess', data: { distributed: true } }), '/apps/echochess/support');
});
