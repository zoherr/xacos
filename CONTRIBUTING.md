# Contributing to XAOCS

Thank you for considering contributing! XAOCS is an open framework and welcomes contributions of all kinds.

## Development Setup

```bash
git clone https://github.com/xaocs/xaocs.git
cd xaocs
bun install
bun run build
bun run test
```

## Making Changes

1. Fork the repo and create a branch from `main`
2. Make your changes
3. Add tests for new functionality
4. Run `bun run test` — all tests must pass
5. Run `bun changeset` to document your change
6. Submit a pull request

## Commit Convention

We use [Conventional Commits](https://conventionalcommits.org):

```
feat(orm): add soft delete support
fix(auth): prevent timing attack in login
docs(cli): update migrate command examples
chore: update dependencies
```

## Code Standards

- TypeScript strict mode — no `any` without comment explaining why
- Every new function/class needs JSDoc
- Every new feature needs a test
- API routes stay under 20 lines
- Business logic goes in services

## Package Structure

Adding a new package? Follow the existing pattern:
- `packages/<name>/package.json` with correct `exports`
- `packages/<name>/src/index.ts` barrel file
- `packages/<name>/tsconfig.json` extending `../../tsconfig.base.json`
- At least one test file
- `README.md`

## Release Process

Releases happen automatically via [changesets](https://changesets.io) when PRs merge to `main`.

## Questions?

- Open a [Discussion](https://github.com/xaocs/xaocs/discussions)
- Join our [Discord](https://discord.gg/xaocs)
