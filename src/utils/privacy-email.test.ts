import test from 'node:test';
import assert from 'node:assert';
import { readdir, readFile } from 'node:fs/promises';

// Privacy policy and support page sources (src/pages/apps/<slug>/{privacy,
// support}.astro) plus the content documents that feed the generated routes
// (src/content/app-pages/<slug>.md and <slug>-support.md). A hardcoded
// address in any of them would drift from src/consts.ts, so they all get
// scanned.
const PAGE_SOURCE_DIRS = ['src/pages/apps', 'src/content/app-pages'];
const EMAIL_LITERAL = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

async function contactPageSources() {
	const files: string[] = [];

	for (const dir of PAGE_SOURCE_DIRS) {
		for (const entry of await readdir(dir, { recursive: true })) {
			const path = `${dir}/${entry.replace(/\\/g, '/')}`;
			if (/\/(privacy|support)\.astro$/.test(path) || /\.mdx?$/.test(path)) {
				files.push(path);
			}
		}
	}

	return files;
}

test('privacy policies and support pages read the contact address from SITE_EMAIL', async () => {
	const files = await contactPageSources();
	assert.ok(files.length > 0, 'expected at least one privacy policy page or document');

	const offenders: string[] = [];

	for (const file of files) {
		const source = await readFile(file, 'utf8');
		const literal = source.match(EMAIL_LITERAL);
		if (literal) offenders.push(`${file}: ${literal[0]}`);
	}

	assert.deepStrictEqual(
		offenders,
		[],
		`Hardcoded email address in a privacy policy — import SITE_EMAIL from src/consts instead:\n${offenders.join('\n')}`,
	);
});
