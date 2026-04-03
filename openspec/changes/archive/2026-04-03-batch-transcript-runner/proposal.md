## Why

Running `fetch_transcripts.py` manually for each video URL is tedious and error-prone. We need a URL list file that the user maintains, and a runner script that processes the list idempotently — skipping videos whose transcripts have already been fetched — so the workflow can be run repeatedly as new URLs are added.

## What Changes

- Add `data/video_urls.txt` — a plain-text file where the user maintains YouTube URLs to process (one per line, supports comments).
- Add `scripts/run_batch.py` — a helper script that reads the URL list, checks which videos already have transcripts in `data/transcripts/`, and invokes `fetch_transcripts.py` only for unprocessed videos.

## Capabilities

### New Capabilities
- `batch-runner`: Idempotent batch processing logic — reads URL list, determines which videos are already processed, and runs `fetch_transcripts.py` for the remaining ones.

### Modified Capabilities
<!-- None — fetch_transcripts.py is unchanged. -->

## Impact

- **New files**: `data/video_urls.txt`, `scripts/run_batch.py`
- **Existing files**: No changes to `scripts/fetch_transcripts.py`
- **Dependencies**: None — uses only stdlib and shells out to the existing script via `uv run`
