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
	assert.equal(schema.mainEntityOfPage['@id'], `${SITE_URL}/tools/secretsweep/#webpage`);
	assert.deepEqual(schema.sameAs, ['https://www.npmjs.com/package/@fanioz/secretsweep']);
	assert.equal(schema.isBasedOn['@type'], 'SoftwareSourceCode');
	assert.equal(schema.isBasedOn['@id'], `${SITE_URL}/tools/secretsweep/#sourcecode`);
	assert.equal(schema.isBasedOn.codeRepository, 'https://github.com/BenihDev/secretsweep');
	// Non-language tech-stack entries (Node.js, CLI) are filtered out.
	assert.deepEqual(schema.isBasedOn.programmingLanguage, ['TypeScript']);
	// targetProduct belongs on the source-code node, pointing at the app.
	assert.equal(schema.isBasedOn.targetProduct['@id'], `${SITE_URL}/tools/secretsweep/#software`);
	assert.equal('targetProduct' in schema, false);
	// npm page is a listing, not a download URL
	assert.equal('downloadUrl' in schema, false);
	// no fabricated rating/review data
	assert.equal('aggregateRating' in schema, false);
	assert.equal('review' in schema, false);
	assert.equal('softwareVersion' in schema, false);
});

test('software application schema honours an explicit page path', async () => {
	const { softwareApplicationSchema } = await import('./schema.ts');
	const schema = softwareApplicationSchema({
		title: 'x', description: 'y', slug: 'x', techStack: [], path: '/projects/x/',
	});
	assert.equal(schema['@id'], `${SITE_URL}/projects/x/#software`);
	assert.equal(schema.mainEntityOfPage['@id'], `${SITE_URL}/projects/x/#webpage`);
});

test('software application schema omits optional links when absent', async () => {
	const { softwareApplicationSchema } = await import('./schema.ts');
	const schema = softwareApplicationSchema({ title: 'x', description: 'y', slug: 'x', techStack: [] });
	assert.equal('isBasedOn' in schema, false);
	assert.equal('sameAs' in schema, false);
	assert.equal('downloadUrl' in schema, false);
	assert.equal('targetProduct' in schema, false);
});
