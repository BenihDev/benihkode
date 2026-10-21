import test from 'node:test';
import assert from 'node:assert';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const PRIVACY_DIR = 'src/pages/projects';
const EMAIL_LITERAL = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

function isMissingFile(error: unknown) {
	return (error as NodeJS.ErrnoException)?.code === 'ENOENT';
}

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
	let read = 0;

	for (const file of files) {
		let source: string;
		try {
			source = await readFile(file, 'utf8');
		} catch (error) {
			// A project directory that ships no privacy policy is expected; anything
			// else means the guard did not inspect a file it was supposed to.
			if (isMissingFile(error)) continue;
			throw error;
		}
		read++;

		const literal = source.match(EMAIL_LITERAL);
		if (literal) offenders.push(`${file}: ${literal[0]}`);
	}

	assert.ok(read > 0, 'expected to read at least one privacy policy page');

	assert.deepStrictEqual(
		offenders,
		[],
		`Hardcoded email address in a privacy policy — import SITE_EMAIL from src/consts instead:\n${offenders.join('\n')}`,
	);
});
