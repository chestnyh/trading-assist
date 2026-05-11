# Design: Logging For Rules (Rule Detail Page)

## Link to task

https://app.clickup.com/t/86c9qkv6z

## Overview

We need an area on the rule detail page where users can see logs produced by rule execution. Logs must reflect what the user defined in their rule (format and content), and should be visible in near–real time while the rule runs.

This ticket does not implement code changes. It documents a plan for follow-up implementation.

## Goals

- Show rule execution logs on the rule detail page.
- Near real-time delivery (streaming) while the rule runs.
- Preserve user-defined log format (plain text vs. structured).
- Handle failures gracefully (service restarts, network disconnects, message loss).

## Non-goals (for initial iteration)

- Full-text search across historical logs.
- Cross-rule aggregated log views.
- Advanced analytics/metrics.

## Current system (high-level)

- Rules are executed by `apps/auto-trader` via the actions engine.
- UI is `apps/user-control-panel`.
- API is `apps/api`.
- Internal service communication exists via `@trading-bot/service-comm` (topics, subscribe/publish).

## 1) Action semantics (what should this action do?)

### Recommendation: reuse existing `log` action

From the user’s perspective, they already have a `log` action in rule bodies. The cleanest UX is to reuse it and make it drive both:

- developer/operator logs (server console / structured logger)
- user-visible “rule execution logs” on the rule detail page

This avoids introducing a second user-facing logging action and keeps rule bodies stable.

### Proposed behavior when a rule emits a log entry

When `log` runs inside a rule execution:

- It produces a `RuleLogEntry` payload (plain text or structured).
- The payload is published to a transport channel keyed by `ruleId` (+ `runId`).
- The system stores the log entry for short-term replay (buffer) and optionally persists it for history.
- Any connected UI clients subscribed to that rule receive the log entry in near real-time.

### Log payload shape (proposal)

`RuleLogEntry`:

- `ruleId: number`
- `runId: string` (unique per runner start; helps to separate restarts)
- `timestamp: string` (ISO)
- `level: 'info' | 'warn' | 'error' | 'debug'` (default `info`)
- `type: 'text' | 'json'`
- `message?: string`
- `data?: Record<string, unknown>` (structured payload)

### Where do logs live?

We should support two layers:

- **Hot buffer (required)**: fast replay for reconnects and initial page load.
- **Long-term persistence (optional / phase 2)**: user can view logs from past runs.

Initial suggested storage:

- Hot buffer in **Redis** using a capped list per rule (e.g. last 500–2000 entries). TTL (e.g. 24–72h).

Phase 2 (optional):

- Persist to Postgres (new table `RuleExecutionLog`) with retention policy (e.g. 7/30 days) and paging.

## 2) Real-time delivery technology (UI receives logs)

### Recommendation: WebSockets (NestJS gateway) + Redis buffer

Why:

- Near real-time push is a natural fit for WebSockets.
- UI can maintain a live subscription while the rule detail page is open.
- Works well with “tail -f” UX.

Alternative considered:

- Server-Sent Events (SSE) — simpler than WS but less flexible for bidirectional control.

### Transport / flow (proposal)

1. `auto-trader` emits log entries during execution.
2. `auto-trader` publishes them via service communication layer (e.g. topic `auto-trader.rule.log`).
3. `api` subscribes to that topic and:
   - stores entries into Redis hot buffer
   - forwards entries to connected WebSocket clients subscribed to that `ruleId`
4. `user-control-panel` connects to `api` WS endpoint and subscribes to `ruleId` room/channel.
5. On initial page load, UI requests “last N logs” via REST endpoint to fill initial view, then continues streaming via WS.

### API surface (proposal)

- REST:
  - `GET /api/v1/rules/:id/logs?limit=200&before=<cursor>` — returns buffered logs (Redis) and a cursor.
- WS:
  - `subscribe_rule_logs` with `{ ruleId }`
  - server emits `rule_log_entry` events

Auth:

- Use existing JWT auth. WS handshake should validate token.

## UI plan (rule detail page)

### Components / UX

- A new “Logs” panel on rule detail page:
  - live stream with auto-scroll (toggle to pause)
  - level filter (info/warn/error/debug)
  - structured logs rendered as expandable JSON
  - copy to clipboard

### Data handling

- On mount:
  - fetch last N logs via REST (buffer replay)
  - connect WS and subscribe to the rule
- On reconnect:
  - refetch last N logs (or from last cursor) to cover missed entries

## 3) Error cases / failure modes

### Rule runner restart / service restart

- Each runner start generates a new `runId`.
- UI displays `runId` boundaries (optional) or at least continues showing logs.
- Hot buffer TTL ensures recent logs survive UI refreshes.

### Network disconnect / WS reconnect

- UI should:
  - show “Disconnected, reconnecting…”
  - attempt reconnect with backoff
  - on reconnect, fetch logs since last cursor/time to avoid gaps

### Message loss / ordering

- Use monotonically increasing `seq` per `ruleId` or store timestamp + server-side cursor.
- Client should handle duplicates gracefully.

### Backpressure / huge log volume

- Enforce server-side limits:
  - max events per second per rule (rate limit)
  - max buffer size (capped list)
- UI should virtualize list rendering for performance.

### Storage outage (Redis down)

- System should still not crash rule execution.
- If Redis unavailable:
  - best-effort WS forward only
  - UI shows live logs while connected, but replay may be unavailable

### API down

- auto-trader continues running rules.
- Logs won’t reach UI until API recovers.
- On recovery, streaming resumes; missed logs may be lost unless stored elsewhere.

## Implementation phases

### Phase 1 (MVP)

- Extend existing `log` action to emit `RuleLogEntry` events.
- Publish log events from auto-trader to API via service comm.
- API WS gateway to broadcast per-rule logs.
- Redis hot buffer + REST endpoint for last N logs.
- UI logs panel with live streaming + basic formatting.

### Phase 2 (Nice-to-have)

- Persist logs to Postgres with paging and retention.
- Search/filter by fields.
- Export/download.

## Open questions

- Should users see logs only while a rule is running, or also historical logs by default?
- Do we need per-user data isolation for logs at the API layer (likely yes: user can only subscribe to their own ruleId)?
- Retention requirements and storage budget.
