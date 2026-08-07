<!--
Sync Impact Report:
- Version change: (unversioned template) → 1.0.0
- Modified principles:
  - [PRINCIPLE_1_NAME] → I. Clean Code
  - [PRINCIPLE_2_NAME] → II. Simple UI/UX
  - [PRINCIPLE_3_NAME] → III. Microservice Architecture
  - [PRINCIPLE_4_NAME] → IV. Tested Code (NON-NEGOTIABLE)
  - [PRINCIPLE_5_NAME] → V. Shared Libraries as Separate Projects
- Added sections:
  - Technology Stack
  - Development Workflow
  - Governance (filled)
- Removed sections: none (template placeholders replaced)
- Follow-up TODOs: none
-->

# Trading Assist Constitution

## Core Principles

### I. Clean Code
All production code MUST be readable, intentional, and free of unnecessary
complexity. Names MUST describe purpose; functions and modules MUST do one
job; duplication MUST be removed when it obscures behavior. Dead code,
commented-out blocks, and speculative abstractions MUST NOT ship.
Complexity beyond the problem at hand MUST be justified in review.

**Rationale**: Clean code keeps a trading platform maintainable under
changing strategies, markets, and team ownership.

### II. Simple UI/UX
User-facing interfaces MUST prioritize clarity and task completion over
visual density. Each screen or flow MUST have one primary job; controls
and copy MUST be obvious without training. Prefer progressive disclosure
over packing every option into the first view. Decorative complexity that
does not aid trading decisions MUST NOT be introduced.

**Rationale**: Operators need to configure and monitor rules quickly and
safely; UI noise increases operational risk.

### III. Microservice Architecture
The system MUST be composed of independently deployable services with
clear boundaries and ownership. Services MUST communicate through
explicit contracts (APIs and messages), not shared mutable state or
direct database coupling across service boundaries. A service MUST own
its data and MUST remain replaceable without rewriting the whole
platform.

**Rationale**: Independent services isolate failure domains and let
trading, API, and UI concerns evolve at different rates.

### IV. Shared Libraries as Separate Projects
Reusable code MUST live in dedicated library projects (Nx libs), not
copied across apps or inlined into a single service. Each library MUST
have a clear purpose, its own public API, and independent testability.
App code MUST depend on libraries through declared project boundaries;
cross-cutting utilities MUST NOT be smuggled via relative paths into
unrelated packages. Libraries that are shared across products MAY be
extracted to a separate repository when versioning or ownership requires
it; until then they remain first-class Nx projects in the monorepo.

**Rationale**: Separate library projects enforce reuse, ownership, and
consistent contracts without duplicating domain logic.

### V. Tested Code (NON-NEGOTIABLE)
Behavior that matters MUST be covered by automated tests before or with
the change that introduces it. Unit tests MUST cover domain logic;
integration and contract tests MUST cover service boundaries, shared
schemas, and inter-service messaging. Untested critical paths MUST NOT
merge. Tests MUST be deterministic and runnable in CI.

**Rationale**: Incorrect automation can move real money; tests are the
primary safety net for regressions.

## Technology Stack

The following stack is mandatory unless an amendment updates this
constitution:

- **Language**: TypeScript for application and library code
- **Monorepo**: Nx for project graph, generators, and task orchestration
- **Database**: PostgreSQL as the system of record
- **Log streaming**: Redis for streaming/operational log transport
- **Message queue**: RabbitMQ (RMQ) for asynchronous inter-service
  messaging

New infrastructure or languages MUST NOT be introduced for convenience.
Deviations require a written justification, impact assessment, and
constitution amendment when they become standing practice.

## Development Workflow

- Specs, plans, and tasks MUST align with this constitution before
  implementation proceeds.
- Pull requests MUST demonstrate constitution compliance: clean
  structure, appropriate tests, correct service/library boundaries, and
  stack adherence.
- Breaking changes to shared libraries or service contracts MUST include
  a migration path and updated consumers.
- Documentation MUST stay close to the code it describes; project-level
  docs MUST remain discoverable from the repository documentation index.

## Governance

This constitution supersedes informal practice and conflicting guidance
in docs or tribal knowledge. Amendments MUST update this file, bump
`CONSTITUTION_VERSION` using semantic versioning (MAJOR for incompatible
principle removals/redefinitions, MINOR for new or materially expanded
guidance, PATCH for clarifications), set **Last Amended** to the
amendment date, and record impact in the Sync Impact Report comment.
Compliance MUST be reviewed in PR review and at feature planning
(`/speckit-plan`, `/speckit-tasks`). Unjustified complexity or stack
drift MUST be rejected or tracked as explicit tech debt with an owner.

**Version**: 1.0.0 | **Ratified**: 2026-08-04 | **Last Amended**: 2026-08-04
