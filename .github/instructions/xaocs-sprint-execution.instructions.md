---
description: "Use when asked to implement XAOCS roadmap tasks, sprints, or milestones from agents/Sprints.md. Enforces strict one-sprint-at-a-time execution and sprint-close checks."
name: "XAOCS Sprint Execution"
applyTo: "**"
---
# XAOCS Sprint Execution Rules

- Treat [agents/Sprints.md](agents/Sprints.md) as the source of truth for sprint work.
- Before coding, identify the exact sprint number and goal, then implement only that sprint.
- If no sprint number is explicitly provided, stop and ask for the sprint number before writing code.
- Never mix multiple sprints in one change set. One sprint is one atomic unit.
- Follow the sprint's listed steps and done criteria exactly.
- If a sprint adds logic, add tests in the same sprint.
- Use Bun commands, not npm or yarn.
- Keep TypeScript strict and avoid any.
- Use the architecture conventions in the roadmap (API file conventions, thin handlers, service-oriented logic).

## Required Sprint Close Checklist

- Run build validation from monorepo root using Bun.
- Update [CHANGELOG.md](CHANGELOG.md) with one line for the sprint.
- Update [MAINTENANCE.md](MAINTENANCE.md) as the last step before marking the sprint done.
- Do not mark a sprint complete if any required validation fails.

## Safety Rules

- Do not refactor unrelated areas while executing a sprint.
- Do not skip mandatory roadmap constraints to move faster.
- If a sprint conflicts with current code reality, report the conflict and propose the smallest compliant adjustment.
