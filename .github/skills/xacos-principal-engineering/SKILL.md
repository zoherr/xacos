---
name: xacos-principal-engineering
description: 'Principal-level XAOCS framework implementation workflow for sprint execution, architecture decisions, strict TypeScript, Bun/Turbo monorepo standards, and production-grade quality gates. Use for XAOCS sprints, framework internals, package design, routing/ORM/middleware/compiler work, and maintainability-first implementation.'
argument-hint: 'Sprint number and target deliverable (for example: Implement Sprint 12 end-to-end)'
user-invocable: true
disable-model-invocation: false
---

# XAOCS Principal Engineering

## What This Skill Produces

This skill produces production-grade XAOCS implementations that are:
- Sprint-scoped and atomic (one sprint at a time)
- Architecturally consistent with XAOCS conventions
- Strictly typed with maintainable, explicit APIs
- Validated by tests and build checks
- Documented through required maintenance artifacts

## Use This Skill When

Use this for:
- Implementing XAOCS roadmap sprints
- Designing or extending framework internals
- Building package-level capabilities in the monorepo
- Creating routing, middleware, ORM, compiler, SSR, CLI, or DX features
- Performing architecture-first refactors that preserve conventions

Do not use this for:
- Casual snippets with no XAOCS context
- Multi-sprint batching in one change set

## Required Inputs

Provide:
- Sprint number and sprint title
- Expected output files or package area
- Any repo constraints discovered during implementation

If sprint number is missing, stop and ask for it before coding.

## Engineering Standards

- Use Bun and TurboRepo conventions only.
- Use strict TypeScript with zero any.
- Keep explicit exports in package boundaries.
- Keep API handlers thin; business logic belongs in services.
- Use file-based route discovery via *.api.ts conventions.
- Do not manually register routes when scanner-based mounting is expected.
- Prefer convention-over-configuration and auto-discovery patterns.
- Design for extensibility, DX, performance, and maintainability.

## Workflow

1. Scope Lock
- Read the sprint specification from agents/Sprints.md.
- Confirm goal, steps, done criteria, and affected paths.
- Define explicit out-of-scope items to avoid sprint bleed.

2. Architecture Pass
- Map sprint requirements to XAOCS architecture rules.
- For core patterns (IoC, routing scanner, ORM internals, SSR pipeline, compiler flow), compare expected behavior with mature framework patterns before implementation.
- Choose abstractions that preserve internal API stability.

3. Implementation Plan
- Break into minimal commits/changes within the same sprint.
- Identify interfaces, modules, and tests to create or update.
- Keep public surface explicit and package exports clear.

4. Implementation
- Implement using modular boundaries and typed contracts.
- Handle edge cases and failure paths explicitly.
- Maintain clean dependency direction to avoid circular coupling.

5. Verification
- Add or update tests for introduced logic.
- Run sprint-relevant checks and root build validation.
- Fix regressions before sprint close.

6. Sprint Close
- Update CHANGELOG.md with one sprint line.
- Update MAINTENANCE.md as the final step.
- Mark sprint complete only when all done criteria pass.

## Decision Points And Branching

- Missing sprint number:
  Ask for sprint number and halt implementation.

- Sprint conflicts with current repo state:
  Report the conflict, propose smallest compliant adjustment, then continue only after alignment.

- Requirement implies multiple sprints:
  Implement only the requested sprint and list follow-up work for next sprint.

- Tests unavailable for target area:
  Create focused test files adjacent to new logic when feasible; otherwise record testing gap explicitly.

- Performance-sensitive path:
  Favor low-overhead abstractions and measurable behavior.

## Quality Gates (Must Pass)

- Scope: exactly one sprint implemented
- Types: strict TypeScript and no any introduced
- Architecture: conventions preserved (routing, services, discovery, package boundaries)
- Tests: logic changes covered by tests
- Build: root build/check succeeds
- Maintenance: CHANGELOG.md updated; MAINTENANCE.md updated last

## Output Format Guidelines

When reporting completion:
- State sprint number, goal, and status.
- List changed files grouped by package/app area.
- Summarize architectural decisions and trade-offs.
- Provide validation results (tests/build).
- Note follow-up items for the next sprint only.



