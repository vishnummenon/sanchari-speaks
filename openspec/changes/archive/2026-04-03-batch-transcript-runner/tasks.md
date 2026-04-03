## 1. URL List File

- [x] 1.1 Create `data/video_urls.txt` with a header comment explaining the format and a few seed Sancharam URLs

## 2. Batch Runner Script

- [x] 2.1 Create `scripts/run_batch.py` with uv inline script metadata (no external deps needed)
- [x] 2.2 Implement URL list parser: read `data/video_urls.txt`, skip comments and blank lines
- [x] 2.3 Implement video ID extraction from URLs (for idempotency check)
- [x] 2.4 Implement idempotency check: skip URLs whose `data/transcripts/<video_id>.json` already exists
- [x] 2.5 Print status summary: total, already processed, to process
- [x] 2.6 Invoke `uv run scripts/fetch_transcripts.py` with all unprocessed URLs in a single subprocess call

## 3. Testing & Verification

- [x] 3.1 Run `run_batch.py` with seed URLs — verify it processes new videos
- [x] 3.2 Run `run_batch.py` again — verify it skips already-processed videos (idempotency)
