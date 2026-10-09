import test from 'node:test';
import assert from 'node:assert/strict';
import { breadcrumbSchema, SITE_URL } from './schema.ts';

test('breadcrumb lists have distinct page identities when the final crumb has no path', () => {
	const pages = ['/blog/building-gitprgen/', '/blog/building-secretsweep/'];
	const schemas = pages.map((path) => breadcrumbSchema([
		{ label: 'Journal', path: '/blog/' },
		{ label: 'Build story' },
	], `${SITE_URL}${path}`));

	assert.deepEqual(schemas.map((schema) => schema['@id']), [
		`${SITE_URL}/blog/building-gitprgen/#breadcrumb`,
		`${SITE_URL}/blog/building-secretsweep/#breadcrumb`,
	]);
	for (const schema of schemas) {
		assert.deepEqual(schema.itemListElement, [
			{ '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
			{ '@type': 'ListItem', position: 2, name: 'Journal', item: `${SITE_URL}/blog/` },
			{ '@type': 'ListItem', position: 3, name: 'Build story' },
		]);
	}
});

test('breadcrumb identity uses the page URL while preserving an explicit final item', () => {
	const schema = breadcrumbSchema([{ label: 'Journal', path: '/blog/' }], `${SITE_URL}/blog`);

	assert.equal(schema['@id'], `${SITE_URL}/blog#breadcrumb`);
	assert.equal(schema.itemListElement.at(-1)?.item, `${SITE_URL}/blog/`);
});

test('software application schema describes a free developer CLI tool', async () => {
	const { softwareApplicationSchema } = await import('./schema.ts');
	const schema = softwareApplicationSchema({
		title: 'secretsweep',
		description: 'Secret scanning.',
		slug: 'secretsweep',
		techStack: ['TypeScript', 'Node.js', 'CLI'],
		githubUrl: 'https://github.com/BenihDev/secretsweep',
		npmPackage: '@fanioz/secretsweep',
	});

	assert.equal(schema['@type'], 'SoftwareApplication');
	assert.equal(schema['@id'], `${SITE_URL}/tools/secretsweep/#software`);
	assert.equal(schema.applicationCategory, 'DeveloperApplication');
	assert.deepEqual(schema.offers, { '@type': 'Offer', price: '0', priceCurrency: 'USD' });
	assert.equal(schema.codeRepository, 'https://github.com/BenihDev/secretsweep');
	assert.equal(schema.downloadUrl, 'https://www.npmjs.com/package/@fanioz/secretsweep');
	assert.equal('softwareVersion' in schema, false);
});

test('software application schema omits optional links when absent', async () => {
	const { softwareApplicationSchema } = await import('./schema.ts');
	const schema = softwareApplicationSchema({ title: 'x', description: 'y', slug: 'x', techStack: [] });
	assert.equal('codeRepository' in schema, false);
	assert.equal('downloadUrl' in schema, false);
});
