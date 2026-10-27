import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);

function readRepositoryFile(relativePath) {
  return readFileSync(path.join(repositoryRoot, relativePath), 'utf8');
}

test('defines local linting, formatting, and test commands', () => {
  const packageJson = JSON.parse(readRepositoryFile('package.json'));

  assert.equal(packageJson.scripts.lint, 'eslint .');
  assert.equal(packageJson.scripts['format:check'], 'prettier --check .');
  assert.equal(packageJson.scripts.test, 'node --test');
});

test('declares the quality-tool dependencies', () => {
  const packageJson = JSON.parse(readRepositoryFile('package.json'));
  const developmentDependencies = packageJson.devDependencies ?? {};

  for (const dependency of ['eslint', 'prettier', 'husky', 'lint-staged']) {
    assert.ok(
      developmentDependencies[dependency],
      `Expected ${dependency} in devDependencies`,
    );
  }
});

test('runs lint-staged checks from the pre-commit hook', () => {
  const hookPath = path.join(repositoryRoot, '.husky/pre-commit');

  assert.equal(existsSync(hookPath), true, 'Expected a pre-commit hook');
  assert.match(readFileSync(hookPath, 'utf8'), /lint-staged/u);
});

test('runs quality checks in continuous integration', () => {
  const workflowPath = path.join(repositoryRoot, '.github/workflows/ci.yml');

  assert.equal(existsSync(workflowPath), true, 'Expected a CI workflow');

  const workflow = readFileSync(workflowPath, 'utf8');
  assert.match(workflow, /npm ci/u);
  assert.match(workflow, /npm run lint/u);
  assert.match(workflow, /npm run format:check/u);
  assert.match(workflow, /npm test/u);
});
