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

- Hot buffer in **Redis Streams** — one stream per rule (`rule-logs:<ruleId>`), capped via MAXLENGTH (e.g. last 1000–2000 entries) with a TTL (e.g. 24–72h). Redis Streams provide ordering, ID-based cursors, and consumer group support out of the box.

Phase 2 (optional):

- Persist to Postgres (new table `RuleExecutionLog`) with retention policy (e.g. 7/30 days) and paging.

## 2) Real-time delivery technology (UI receives logs)

### Decision: Server-Sent Events (SSE)

Communication is strictly server → client (backend pushes log entries, UI only listens). SSE is sufficient for this use-case and avoids the overhead and complexity of WebSockets.

### New service: `apps/log-stream`

`api` is not involved in log streaming. Streaming connections are long-lived and could block other more critical request handling in `api`. A dedicated `log-stream` service owns this responsibility:

- Consumes log entries from Redis Stream.
- Holds SSE connections from UI clients.
- Pushes entries to the correct connected clients by `ruleId`.

### Data flow

```
auto-trader → Redis Stream → log-stream → user-control-panel (SSE)
```

Step by step:

1. `auto-trader` `log` action writes a `RuleLogEntry` to a **Redis Stream** (key: `rule-logs:<ruleId>`).
2. `log-stream` service runs a consumer group reading from that stream.
3. When a UI client opens an SSE connection for a `ruleId`, `log-stream` replays recent entries from the stream and then pushes new ones as they arrive.
4. `user-control-panel` connects to `log-stream` SSE endpoint, receives events, and renders them.

### Redis Streams storage

Redis Streams are used as both the transport and the hot buffer:

- Stream key per rule: `rule-logs:<ruleId>`
- **MAXLENGTH**: capped (e.g. last 1000–2000 entries) using `XADD ... MAXLEN ~ <n>` to prevent unbounded growth.
- **TTL**: set a TTL on the stream key (e.g. 24–72h) to auto-expire old logs.
- **Message size limit**: enforce a max byte length on `message` field (e.g. 2 KB) at write time in the `log` action, to discourage abuse and reduce storage pressure. Oversized messages are truncated or rejected with a warning.

These constraints motivate users to log deliberately rather than flooding with high-volume or large payloads.

### API surface

`log-stream` exposes:

- SSE:
  - `GET /stream/rules/:ruleId/logs` — opens SSE connection, replays recent entries then streams live.
- REST (replay only, for initial page load):
  - `GET /stream/rules/:ruleId/logs/history?limit=200&lastId=<redis-stream-id>` — returns buffered entries and the last stream entry ID as cursor.

Auth:

- JWT token validated on SSE connection (via `Authorization` header or `?token=` query param).
- `log-stream` validates the token and checks that the requesting user owns the `ruleId` (via a call to `api` or shared JWT secret).

## UI plan (rule detail page)

### Components / UX

- A new "Logs" panel on rule detail page:
  - live stream with auto-scroll (toggle to pause)
  - level filter (info/warn/error/debug)
  - structured logs rendered as expandable JSON
  - copy to clipboard

### Data handling

- On mount:
  - fetch last N logs via REST history endpoint (buffer replay) to fill initial view
  - open SSE connection to `log-stream` for live entries
- On reconnect:
  - reopen SSE connection; use last received stream entry ID to request only missed entries
  - show "Reconnecting…" indicator during gap

## 3) Error cases / failure modes

### Rule runner restart / service restart

- Each runner start generates a new `runId`.
- UI displays `runId` boundaries (optional) or at least continues showing logs.
- Redis Stream TTL + MAXLENGTH ensures recent logs survive UI refreshes.

### Network disconnect / SSE reconnect

- UI should:
  - show "Disconnected, reconnecting…"
  - attempt reconnect with exponential backoff
  - on reconnect, request entries since last received stream ID to avoid gaps

### Message loss / ordering

- Redis Streams provide ordered, ID-stamped entries — no need for a separate `seq` field.
- Client uses the stream entry ID as cursor for replay and gap-fill requests.
- Client should handle duplicate entries gracefully (deduplicate by stream entry ID).

### Backpressure / huge log volume

- Server-side limits enforced at write time:
  - `MAXLENGTH` cap on Redis Stream per rule
  - max message byte length (e.g. 2 KB) — oversized entries are truncated with a warning appended
- UI should virtualize list rendering for performance when many entries are visible.

### Storage outage (Redis down)

- `log` action must not crash rule execution if Redis is unavailable — write failures are caught and logged to server console only.
- If Redis is unavailable: `log-stream` cannot replay or push entries; UI shows a "Logs unavailable" state.

### `log-stream` service down

- `auto-trader` continues writing to Redis Stream unaffected.
- UI shows "Disconnected" state.
- On `log-stream` recovery, SSE connections resume and clients can replay missed entries from the stream.

## Implementation phases

### Phase 1 (MVP)

- Extend existing `log` action to write `RuleLogEntry` to Redis Stream with MAXLENGTH + message size limit.
- Create `apps/log-stream` NestJS service with SSE endpoint and Redis Stream consumer.
- REST history endpoint on `log-stream` for initial page load replay.
- UI logs panel with live SSE streaming, basic formatting, auto-scroll, and level filter.

### Phase 2 (Nice-to-have)

- Persist logs to Postgres with paging and retention policy.
- Search/filter by fields.
- Export/download.

## Open questions

- Should users see logs only while a rule is running, or also historical logs by default?
- Do we need per-user data isolation for logs at the `log-stream` layer (likely yes: user can only subscribe to their own `ruleId`)?
- Retention requirements and storage budget (MAXLENGTH value, TTL duration).
- Should `log-stream` call `api` to verify ownership, or rely solely on JWT claims?
