import test from 'node:test';
import assert from 'node:assert';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const PRIVACY_DIR = 'src/pages/projects';
const EMAIL_LITERAL = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

async function privacyPolicySources() {
	const entries = await readdir(PRIVACY_DIR, { withFileTypes: true });
	const files: string[] = [];

	for (const entry of entries) {
		if (entry.isFile() && entry.name === 'privacy-policy.astro') {
			files.push(join(PRIVACY_DIR, entry.name));
		}
		if (entry.isDirectory()) {
			files.push(join(PRIVACY_DIR, entry.name, 'privacy-policy.astro'));
		}
	}

	return files;
}

test('privacy policies read the contact address from SITE_EMAIL', async () => {
	const files = await privacyPolicySources();
	assert.ok(files.length > 0, 'expected at least one privacy policy page');

	const offenders: string[] = [];

	for (const file of files) {
		let source: string;
		try {
			source = await readFile(file, 'utf8');
		} catch {
			continue; // directory without a privacy policy
		}

		const literal = source.match(EMAIL_LITERAL);
		if (literal) offenders.push(`${file}: ${literal[0]}`);
	}

	assert.deepStrictEqual(
		offenders,
		[],
		`Hardcoded email address in a privacy policy — import SITE_EMAIL from src/consts instead:\n${offenders.join('\n')}`,
	);
});
