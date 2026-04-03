## Context

We have `scripts/fetch_transcripts.py` which extracts Malayalam transcripts from individual YouTube URLs. The user needs to process ~25 Sancharam episodes and will add URLs over time. Running the script manually each time is tedious, and re-processing already-fetched videos wastes time.

## Goals / Non-Goals

**Goals:**
- A URL list file the user can edit to add new videos
- A runner script that processes only new (unprocessed) URLs
- Idempotent execution — safe to run repeatedly

**Non-Goals:**
- Modifying `fetch_transcripts.py` itself
- Parallel processing or async execution
- A database or state file — the existing transcript JSON files are the source of truth

## Decisions

### 1. Idempotency via filesystem check

**Choice**: Determine "already processed" by checking if `data/transcripts/<video_id>.json` exists.
**Rationale**: The transcript files are the actual output. No separate state file needed — if the JSON exists, the video was processed. This is simple and self-healing (deleting a JSON file causes re-processing).
**Alternative considered**: A `processed.log` tracking file — adds state management complexity and can drift out of sync with actual files.

### 2. Plain text URL list

**Choice**: `data/video_urls.txt` — one URL per line, `#` for comments, blank lines ignored.
**Rationale**: Easy to edit in any text editor, version-controllable, no parsing library needed.
**Alternative considered**: JSON or YAML list — heavier to hand-edit for a simple list of URLs.

### 3. Runner shells out to `fetch_transcripts.py`

**Choice**: `run_batch.py` invokes `uv run scripts/fetch_transcripts.py` for each unprocessed URL (or batches them in a single call).
**Rationale**: Keeps the runner decoupled from extraction logic. If `fetch_transcripts.py` changes, the runner doesn't need updating.
**Alternative considered**: Importing functions directly — creates coupling, and `fetch_transcripts.py` uses uv inline script metadata (not a package).

### 4. Batch invocation

**Choice**: Pass all unprocessed URLs to `fetch_transcripts.py` in a single invocation rather than one-at-a-time.
**Rationale**: Fewer subprocess calls, simpler logging, `fetch_transcripts.py` already handles multiple URLs.

## Risks / Trade-offs

- **Video ID extraction duplication** — `run_batch.py` needs to extract video IDs from URLs to check for existing files, duplicating logic from `fetch_transcripts.py`. Mitigation: keep it minimal (same regex), accept the small duplication for decoupling benefit.
- **Partial failures** — If `fetch_transcripts.py` crashes mid-batch, some videos won't have transcripts. Mitigation: idempotency means you just re-run and it picks up where it left off.
