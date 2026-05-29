---
name: issue-planner
description: Enters planning mode to clarify a task through questions, uses grill-me when needed, and creates one or more GitHub issues from repository issue templates. Use when the team wants to break work into bug/config/epic/feature/story/task.
---

# Issue planner

Use this skill when a task description must be clarified and turned into concrete issues.

## Workflow

1. **Start in planning mode**
   - Summarize the goal briefly.
   - Identify ambiguities and risks.
   - Ask one question at a time until requirements, scope, and boundaries are clear.

2. **Clarify before creating issues**
   - Do not create issues until acceptance criteria, dependencies, and expected delivery are understood.
   - If answers are shallow or inconsistent, use `grill-me` to drive clear decisions.
   - Confirm in particular: desired outcome, constraints, priority order, and definition of done.

3. **Choose issue type per deliverable**
   - `bug`: defect in existing functionality.
   - `config`: change to setup, environment, CI/CD, policy, or configuration.
   - `epic`: large deliverable that should be split into multiple issues.
   - `feature`: new end-user or system functionality.
   - `story`: user need with clear value and acceptance criteria.
   - `task`: scoped technical activity without a standalone user story.

4. **Create issue(s) from templates**
   - Use template fields consistently (problem, goal, scope, acceptance criteria, dependencies).
   - Split into multiple issues when work differs by type, owner, or deliverable.
   - Link child issues to an epic when relevant.

## Quality requirements

- Make no assumptions about unconfirmed requirements.
- Each issue must be executable without extra verbal context.
- Acceptance criteria must be concrete and testable.
