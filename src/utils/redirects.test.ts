import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { projectEntry, projectRedirects } from '../../scripts/gen-redirects.mjs';

// The guard parses the real entries with the generator's own parser, so this
// check can never drift from what the prebuild actually derived.

test('distributed app entries emit landing, support, and privacy pairs in both slash forms with a 301', () => {
	const redirects = projectRedirects([{ slug: 'echochess', category: 'app', distributed: true }]);

	// Expected values are literals from the spec, not recomputed from the code
	// under test, so a wrong origin or path shape fails here.
	assert.deepEqual(redirects, [
		{ source: '/projects/echochess', destination: 'https://www.benihkode.web.id/apps/echochess/', statusCode: 301 },
		{ source: '/projects/echochess/', destination: 'https://www.benihkode.web.id/apps/echochess/', statusCode: 301 },
		{
			source: '/projects/echochess/support',
			destination: 'https://www.benihkode.web.id/apps/echochess/support/',
			statusCode: 301,
		},
		{
			source: '/projects/echochess/support/',
			destination: 'https://www.benihkode.web.id/apps/echochess/support/',
			statusCode: 301,
		},
		{
			source: '/projects/echochess/privacy-policy',
			destination: 'https://www.benihkode.web.id/apps/echochess/privacy/',
			statusCode: 301,
		},
		{
			source: '/projects/echochess/privacy-policy/',
			destination: 'https://www.benihkode.web.id/apps/echochess/privacy/',
			statusCode: 301,
		},
	]);
});

test('apps without the distributed marker emit only landing pairs', () => {
	const redirects = projectRedirects([{ slug: 'chatmini', category: 'app', distributed: false }]);

	assert.deepEqual(redirects, [
		{ source: '/projects/chatmini', destination: 'https://www.benihkode.web.id/apps/chatmini/', statusCode: 301 },
		{ source: '/projects/chatmini/', destination: 'https://www.benihkode.web.id/apps/chatmini/', statusCode: 301 },
	]);
});

test('tool entries keep their existing pairs pointing at /tools/<slug>', () => {
	const redirects = projectRedirects([{ slug: 'gitprgen', category: 'tool' }]);

	assert.deepEqual(redirects, [
		{ source: '/projects/gitprgen', destination: 'https://www.benihkode.web.id/tools/gitprgen/', permanent: true },
		{ source: '/projects/gitprgen/', destination: 'https://www.benihkode.web.id/tools/gitprgen/', permanent: true },
	]);
});

test('entries with a category outside tool/app emit no redirect', () => {
	assert.deepEqual(projectRedirects([{ slug: 'mystery', category: 'widget', distributed: true }]), []);
	assert.deepEqual(projectRedirects([{ slug: 'mystery', category: '', distributed: false }]), []);
});

test('a missing category falls back to app, matching the content schema default', () => {
	// The zod schema is z.enum(['tool', 'app']).default('app'), so an entry
	// without a category line IS an app — the generator must treat it the same
	// way instead of silently emitting no redirects for it.
	assert.deepEqual(projectEntry('chatmini', 'title: ChatMini\n'), {
		slug: 'chatmini',
		category: 'app',
		distributed: false,
	});
	assert.equal(projectEntry('gitprgen', 'category: tool\ndistributed: false\n').category, 'tool');
});

test('distributed parses the YAML boolean spellings Astro accepts, case-insensitively', () => {
	for (const variant of ['true', 'True', 'TRUE', 'yes', 'Yes', 'YES']) {
		assert.equal(projectEntry('x', `distributed: ${variant}\n`).distributed, true, variant);
	}
	for (const variant of ['false', 'False', 'no', 'No', '0', '']) {
		assert.equal(projectEntry('x', `distributed: ${variant}\n`).distributed, false, variant);
	}
	// Absent key is not distributed.
	assert.equal(projectEntry('x', 'title: x\n').distributed, false);
});

/**
 * Reads the real project entries instead of fixtures: the guard has to fail on
 * the content that ships, not on a mock that agrees with the implementation.
 */
async function contentEntries(): Promise<Map<string, { slug: string; category: string; distributed: boolean }>> {
	const entries = new Map<string, { slug: string; category: string; distributed: boolean }>();

	for (const file of await readdir('src/content/projects')) {
		if (!/\.mdx?$/.test(file)) continue;
		const [, frontmatter = ''] = (await readFile(join('src/content/projects', file), 'utf8')).split(/^---$/m, 2);
		const entry = projectEntry(file.replace(/\.mdx?$/, ''), frontmatter);
		entries.set(entry.slug, entry);
	}

	return entries;
}

test('vercel.json forwards every shipped app landing, tool landing, and privacy URL derived from frontmatter', async () => {
	const entries = await contentEntries();
	assert.ok(entries.size > 0, 'expected the real project entries to be read');

	const vercel = JSON.parse(await readFile('vercel.json', 'utf8'));
	const emitted = new Map<string, { destination: string }>(
		vercel.redirects.map((redirect: { source: string; destination: string }) => [redirect.source, redirect]),
	);

	const stale: string[] = [];
	for (const entry of entries.values()) {
		for (const expected of projectRedirects([entry])) {
			const actual = emitted.get(expected.source);
			if (!actual || actual.destination !== expected.destination) {
				stale.push(`${expected.source} -> ${expected.destination} (missing or stale; run pnpm build)`);
			}
		}
	}

	assert.deepEqual(
		stale,
		[],
		`vercel.json is missing or has stale redirect pairs:\n${stale.join('\n')}`,
	);
});

test('vercel.json re-points the site-level /support pair at EchoChess support', async () => {
	// /support was EchoChess-only and stays a redirect source, now at the
	// app-owned URL. Literal expectations so a wrong destination fails here.
	const vercel = JSON.parse(await readFile('vercel.json', 'utf8'));
	const bySource = new Map<string, { destination: string; statusCode?: number }>(
		vercel.redirects.map((redirect: { source: string; destination: string; statusCode?: number }) => [redirect.source, redirect]),
	);

	for (const source of ['/support', '/support/']) {
		const redirect = bySource.get(source);
		assert.ok(redirect, `expected a ${source} redirect pair in vercel.json`);
		assert.equal(redirect.destination, 'https://www.benihkode.web.id/apps/echochess/support/');
		assert.equal(redirect.statusCode, 301);
	}
});
