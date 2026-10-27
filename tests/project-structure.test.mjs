import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);

function expectPath(relativePath) {
  assert.equal(
    existsSync(path.join(repositoryRoot, relativePath)),
    true,
    `Expected ${relativePath} to exist`,
  );
}

test('provides the API and web application workspaces', () => {
  expectPath('apps/api');
  expectPath('apps/web');
});

test('declares a workspace-aware root package manifest', () => {
  const packageJson = JSON.parse(
    readFileSync(path.join(repositoryRoot, 'package.json'), 'utf8'),
  );

  assert.equal(packageJson.private, true);
  assert.deepEqual(packageJson.workspaces, ['apps/*']);
});

test('provides shared TypeScript, linting, formatting, and editor configuration', () => {
  expectPath('tsconfig.base.json');
  expectPath('eslint.config.js');
  expectPath('.prettierrc.json');
  expectPath('.editorconfig');
});

test('documents environment-variable setup without committing secrets', () => {
  expectPath('.env.example');
});
