## Why

The Sancharam travel series on YouTube contains rich Malayalam narration, but there is no easy way to extract and store these transcripts for downstream use (search, analysis, content repurposing). A lightweight CLI tool to batch-extract Malayalam captions and persist them as structured JSON will unlock this content for future workflows.

## What Changes

- Add a Python CLI service that accepts a YouTube video URL, a list of URLs, or a playlist URL.
- For each video, fetch the Malayalam subtitle track (auto-generated or manual) using `youtube-transcript-api`.
- Resolve playlist URLs into individual video URLs using `yt-dlp` (playlist expansion only).
- Save each transcript as a JSON file to `data/transcripts/<video_id>.json` with metadata (video ID, title, URL, language) and transcript text (raw continuous + timestamped segments).
- Skip videos without Malayalam captions and log skipped videos with reasons.

## Capabilities

### New Capabilities
- `transcript-extraction`: Core logic for fetching Malayalam captions from YouTube videos via `youtube-transcript-api` and structuring the output as JSON.
- `cli-interface`: Command-line entry point that accepts single URLs, multiple URLs, or playlist URLs, resolves playlists, and orchestrates extraction.

### Modified Capabilities
<!-- None — this is a greenfield service. -->

## Impact

- **New files**: `scripts/fetch_transcripts.py` — single self-contained script with uv inline script metadata.
- **Dependencies**: `youtube-transcript-api`, `yt-dlp` (for playlist resolution only). Declared inline via uv script metadata, no project-level `pyproject.toml` needed.
- **Output directory**: `data/transcripts/` will be created at runtime.
- **No existing code is modified** — this is a new service.
