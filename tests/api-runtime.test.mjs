import assert from 'node:assert/strict';
import test from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const apiDistPath = path.join(repositoryRoot, 'apps/api/dist');

const configModule = await import(
  pathToFileURL(path.join(apiDistPath, 'config.js')).href,
);
const appModule = await import(
  pathToFileURL(path.join(apiDistPath, 'app.js')).href,
);

test('rejects invalid runtime configuration', () => {
  assert.throws(
    () => configModule.loadConfig({ NODE_ENV: 'development', PORT: 'invalid' }),
    /PORT/u,
  );
});

test('returns a healthy status from the health-check endpoint', async (t) => {
  const app = appModule.createApp(
    configModule.loadConfig({ NODE_ENV: 'test', PORT: '0' }),
  );
  const server = app.listen(0);

  t.after(() => server.close());

  await new Promise((resolve) => server.once('listening', resolve));
  const address = server.address();
  assert.ok(address && typeof address !== 'string');

  const response = await fetch(`http://127.0.0.1:${address.port}/health`);

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: 'ok' });
});

test('returns a structured error for an unknown route', async (t) => {
  const app = appModule.createApp(
    configModule.loadConfig({ NODE_ENV: 'test', PORT: '0' }),
  );
  const server = app.listen(0);

  t.after(() => server.close());

  await new Promise((resolve) => server.once('listening', resolve));
  const address = server.address();
  assert.ok(address && typeof address !== 'string');

  const response = await fetch(`http://127.0.0.1:${address.port}/not-a-route`);

  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), {
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found',
    },
  });
});
