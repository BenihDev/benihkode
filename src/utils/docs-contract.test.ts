import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { markdownFiles } from './docs-contract.ts';

const execFileAsync = promisify(execFile);

/**
 * The App-trio contract is documented in agent-facing docs (AGENTS.md,
 * CLAUDE.md, CONTEXT.md, README.md, .agents/skills). When the retired
 * frontmatter fields were replaced by the `distributed` marker and the old
 * /projects/<slug>/... App URLs by the /apps trio, the docs kept describing
 * the old mechanism until a manual sweep caught it. This guard locks that
 * sweep: the docs must never reintroduce the retired vocabulary.
 *
 * Scoped to agent-facing markdown on purpose — build stories and reports may
 * legitimately mention old URLs as history, and scripts/gen-redirects.mjs
 * must reference the old URLs because it emits the redirect sources for them.
 */

// Retired frontmatter fields: replaced by the single `distributed` marker and
// the file-presence escape hatch.
const RETIRED_FIELDS = /\b(hasPrivacyPolicy|hasSupportPage|privacyPolicyUrl)\b/;
// App pages under the old /projects namespace. The bare landing pattern
// (/projects/<slug>) is allowed: AGENTS.md documents the redirects that
// forward it, and the portfolio index legitimately lives at /projects.
const OLD_APP_SUBPAGES = /projects\/(\[slug\]|<slug>)\/(support|privacy-policy)/;
// Route files under pages/projects for app subpages — the trio lives in
// src/pages/apps; only the portfolio index remains under src/pages/projects.
const OLD_APP_ROUTE_FILES = /pages\/projects\/(\[slug\]|<slug>)/;

const FORBIDDEN: Array<[RegExp, string]> = [
	[RETIRED_FIELDS, 'retired frontmatter field (use `distributed` + file-presence escape hatch)'],
	[OLD_APP_SUBPAGES, 'old /projects App subpage URL (use /apps/<slug>/support|privacy)'],
	[OLD_APP_ROUTE_FILES, 'old app route file under src/pages/projects (the trio lives in src/pages/apps)'],
];

// Reviewed mentions of the old subpage URLs as redirect SOURCES. Docs that
// describe the forwarding contract legitimately spell the sources out
// (gen-redirects.mjs and redirects.test.ts own the real list); anything not
// allowlisted here fails. Add entries sparingly and quote the exact substring.
const ALLOWED_REDIRECT_SOURCE_MENTIONS: Array<[file: string, substring: string]> = [
	[
		'AGENTS.md',
		'`/projects/<slug>/support` and `/projects/<slug>/privacy-policy` for distributed Apps',
	],
];

test('agent-facing docs use the shipped App-trio vocabulary, not the retired flags or URLs', async () => {
	const offenders: string[] = [];

	for (const file of await markdownFiles()) {
		const lines = (await readFile(file, 'utf8')).split('\n');
		lines.forEach((line, i) => {
			for (const [pattern, reason] of FORBIDDEN) {
				if (!pattern.test(line)) continue;
				const allowed = ALLOWED_REDIRECT_SOURCE_MENTIONS.some(
					([allowedFile, substring]) => file === allowedFile && line.includes(substring),
				);
				if (!allowed) {
					offenders.push(`${file}:${i + 1}: ${reason}\n    ${line.trim()}`);
				}
			}
		});
	}

	assert.deepEqual(
		offenders,
		[],
		`Stale App-trio references in agent-facing docs (use the \`distributed\` marker, /apps/<slug> URLs, and the file-presence escape hatch):\n${offenders.join('\n')}`,
	);
});

test('docs discovery covers the tracked agent-facing docs, including the .agents tree', async () => {
	const files = await markdownFiles();

	// The guard is only meaningful if it actually sees the docs it protects.
	assert.ok(files.includes('AGENTS.md'), 'expected AGENTS.md to be discovered');
	assert.ok(
		files.some((file) => file.startsWith('.agents/') && /\.mdx?$/.test(file)),
		'expected tracked .agents skill docs to be discovered',
	);
});

test('docs discovery lists git-tracked files only, so untracked agent trees are not swept in', async () => {
	// Agent runs leave self-ignored transcript trees (.zwork) and scratch files
	// next to the real docs. Discovery must see exactly what git sees (what CI
	// checks out), or the guard fails locally on files that were never reviewed.
	const repo = await mkdtemp(join(tmpdir(), 'docs-contract-'));
	try {
		await writeFile(join(repo, '.gitignore'), '.zwork/\n');
		await writeFile(join(repo, 'README.md'), '# Repo\n');
		await mkdir(join(repo, '.agents'), { recursive: true });
		await mkdir(join(repo, '.zwork', 'session-a'), { recursive: true });
		await writeFile(join(repo, '.zwork', 'session-a', 'transcript.md'), '# transcript\n');
		await writeFile(join(repo, 'scratch.md'), 'untracked scratch\n');
		await execFileAsync('git', ['init', '-q'], { cwd: repo });
		await execFileAsync('git', ['add', '.gitignore', 'README.md'], { cwd: repo });

		const files = await markdownFiles(repo);

		assert.deepEqual(files, ['README.md']);
	} finally {
		await rm(repo, { recursive: true, force: true });
	}
});
