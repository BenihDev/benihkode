import test from 'node:test';
import assert from 'node:assert';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..', '..');

test('search.astro page has been removed', () => {
	const searchPage = resolve(ROOT, 'src', 'pages', 'search.astro');
	assert.strictEqual(
		existsSync(searchPage),
		false,
		'src/pages/search.astro should not exist after the pagefind removal'
	);
});

test('package.json does not include pagefind as a devDependency', () => {
	const pkg = JSON.parse(readFileSync(resolve(ROOT, 'package.json'), 'utf-8'));
	assert.ok(
		pkg.devDependencies,
		'package.json should have a devDependencies field'
	);
	assert.strictEqual(
		Object.prototype.hasOwnProperty.call(pkg.devDependencies, 'pagefind'),
		false,
		'pagefind should not be listed in devDependencies'
	);
});

test('package.json does not have a postbuild script', () => {
	const pkg = JSON.parse(readFileSync(resolve(ROOT, 'package.json'), 'utf-8'));
	assert.ok(pkg.scripts, 'package.json should have a scripts field');
	assert.strictEqual(
		Object.prototype.hasOwnProperty.call(pkg.scripts, 'postbuild'),
		false,
		'postbuild script should not exist after pagefind removal'
	);
});

test('package.json retains the build script', () => {
	const pkg = JSON.parse(readFileSync(resolve(ROOT, 'package.json'), 'utf-8'));
	assert.ok(
		pkg.scripts?.build,
		'build script should still be present in package.json'
	);
	assert.strictEqual(pkg.scripts.build, 'astro build');
});

test('package.json retains the test script', () => {
	const pkg = JSON.parse(readFileSync(resolve(ROOT, 'package.json'), 'utf-8'));
	assert.ok(
		pkg.scripts?.test,
		'test script should still be present in package.json'
	);
});

test('package.json devDependencies does not reference any pagefind packages', () => {
	const pkg = JSON.parse(readFileSync(resolve(ROOT, 'package.json'), 'utf-8'));
	const devDeps = Object.keys(pkg.devDependencies ?? {});
	const pagefindEntries = devDeps.filter(dep => dep.includes('pagefind'));
	assert.strictEqual(
		pagefindEntries.length,
		0,
		`No pagefind-related packages should remain in devDependencies, found: ${pagefindEntries.join(', ')}`
	);
});
