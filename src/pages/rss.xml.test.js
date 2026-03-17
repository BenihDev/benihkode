import test from 'node:test';
import assert from 'node:assert';
import { mock } from 'node:test';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import * as consts from '../consts.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));

test('GET function generates correct RSS feed', async (t) => {
  // Mocks
  const getCollectionMock = mock.fn(async () => [
    {
      id: 'post-1',
      data: {
        title: 'Post 1',
        pubDate: new Date('2024-01-01'),
        description: 'Description 1',
      },
    },
    {
      id: 'post-2',
      data: {
        title: 'Post 2',
        pubDate: new Date('2024-01-02'),
        description: 'Description 2',
      },
    },
  ]);

  let rssCalledWith = null;
  const rssMock = mock.fn((config) => {
    rssCalledWith = config;
    return { body: 'mock-rss-xml' };
  });

  // Read the file content
  const filePath = join(__dirname, 'rss.xml.js');
  let content = await readFile(filePath, 'utf8');

  // Strip all imports using a more robust regex
  content = content.replace(/^import\s+[\s\S]*?from\s+['"].*?['"];?/gm, '');

  // Replace export with a simple declaration
  content = content.replace(/export\s+async\s+function\s+GET/g, 'async function GET');

  // Create a function string that we can evaluate
  const scriptContent = `
    const { SITE_TITLE, SITE_DESCRIPTION } = consts;
    const getCollection = getCollectionMock;
    const rss = rssMock;

    ${content}

    return GET;
  `;

  // Evaluate the script in a context with our mocks
  const GET = new Function('getCollectionMock', 'rssMock', 'consts', scriptContent)(
    getCollectionMock,
    rssMock,
    consts
  );

  const context = {
    site: 'https://example.com',
  };

  const response = await GET(context);

  assert.strictEqual(response.body, 'mock-rss-xml');
  assert.strictEqual(getCollectionMock.mock.callCount(), 1);
  assert.strictEqual(getCollectionMock.mock.calls[0].arguments[0], 'blog');

  assert.strictEqual(rssCalledWith.title, consts.SITE_TITLE);
  assert.strictEqual(rssCalledWith.description, consts.SITE_DESCRIPTION);
  assert.strictEqual(rssCalledWith.site, context.site);
  assert.strictEqual(rssCalledWith.items.length, 2);

  // Check the first item
  assert.strictEqual(rssCalledWith.items[0].title, 'Post 1');
  assert.strictEqual(rssCalledWith.items[0].link, '/blog/post-1/');

  // Check the second item
  assert.strictEqual(rssCalledWith.items[1].title, 'Post 2');
  assert.strictEqual(rssCalledWith.items[1].link, '/blog/post-2/');
});
