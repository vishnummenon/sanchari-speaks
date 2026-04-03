## 1. Project Setup

- [x] 1.1 Create `scripts/` directory
- [x] 1.2 Create `scripts/fetch_transcripts.py` with uv inline script metadata declaring `youtube-transcript-api` and `yt-dlp` as dependencies

## 2. Core Implementation (single script)

- [x] 2.1 Implement data structures: `Segment` and `TranscriptResult` dataclasses
- [x] 2.2 Implement URL helpers: `extract_video_id`, `is_playlist_url`, `resolve_playlist`, `fetch_video_title`
- [x] 2.3 Implement transcript extraction: `fetch_malayalam_transcript` with preference for manual captions over auto-generated
- [x] 2.4 Implement JSON output builder: `build_transcript_result` assembling metadata + raw text + timestamped segments
- [x] 2.5 Implement file writer: `save_transcript` saving JSON to `<output_dir>/<video_id>.json`, creating output directory if needed

## 3. CLI Entry Point

- [x] 3.1 Implement `argparse` setup: positional URLs, `--output-dir` flag
- [x] 3.2 Implement main loop: resolve playlists, deduplicate video IDs, extract transcripts sequentially
- [x] 3.3 Implement summary output: print processed/skipped counts and list skipped videos with reasons

## 4. Testing & Verification

- [x] 4.1 Manual test with a single Sancharam video URL
- [x] 4.2 Verify JSON output structure matches spec (all required fields present)
- [x] 4.3 Verify skip behavior for a video without Malayalam captions
