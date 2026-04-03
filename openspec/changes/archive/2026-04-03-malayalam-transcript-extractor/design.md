## Context

This is a greenfield Python CLI tool for extracting Malayalam transcripts from the Sancharam YouTube travel series. There is no existing codebase to integrate with — this is a standalone service that writes structured JSON files to disk.

The primary constraint is simplicity: minimal dependencies, straightforward CLI interface, and a flat output structure (one JSON file per video in `data/transcripts/`).

## Goals / Non-Goals

**Goals:**
- Extract Malayalam captions (auto-generated or manual) from YouTube videos
- Support single video URLs, multiple URLs, and playlist URLs as input
- Produce structured JSON output with metadata and both raw and timestamped transcript text
- Provide clear feedback on which videos were processed and which were skipped

**Non-Goals:**
- Downloading audio or video content (captions only)
- Translation or transliteration of Malayalam text
- A web UI or API server — CLI only
- Handling authentication or age-restricted videos
- Deduplication across runs (overwrite if file exists)

## Decisions

### 1. `youtube-transcript-api` for caption fetching

**Choice**: Use `youtube-transcript-api` as the primary transcript library.
**Rationale**: We only need caption text, not audio/video. This library directly queries YouTube's transcript endpoint without downloading media, making it faster and lighter than `yt-dlp` for this purpose.
**Alternative considered**: `yt-dlp --write-sub` — heavier dependency, designed for media download, would require parsing subtitle file formats (SRT/VTT) into JSON ourselves.

### 2. `yt-dlp` for playlist resolution only

**Choice**: Use `yt-dlp` to expand playlist URLs into individual video URLs and to fetch video titles.
**Rationale**: `youtube-transcript-api` has no playlist support. `yt-dlp`'s `--flat-playlist` mode efficiently extracts video IDs and titles without downloading media. It also reliably fetches video metadata (title) which `youtube-transcript-api` does not provide.
**Alternative considered**: `pytube` — less actively maintained, more prone to breakage from YouTube changes.

### 3. `argparse` for CLI

**Choice**: Use `argparse` from the standard library.
**Rationale**: Minimal dependency footprint. The CLI interface is simple (positional URLs + a few flags), so `click`'s extras aren't needed.
**Alternative considered**: `click` — nicer API but adds a dependency for no functional gain here.

### 4. Flat JSON output structure

**Choice**: One JSON file per video at `data/transcripts/<video_id>.json`.
**Rationale**: Simple to reason about, easy to glob, no database needed. Video ID as filename ensures uniqueness and makes lookup trivial.
**Alternative considered**: Single JSONL file — harder to inspect individual transcripts, concurrent write issues.

### 5. Project structure

```
scripts/
└── fetch_transcripts.py    # Single self-contained script (CLI + extraction + models)
```

Dependencies are declared via uv inline script metadata (`# /// script` block) inside the script itself. No `pyproject.toml` needed — this keeps the data pipeline lightweight and leaves the project root clean for the Next.js web app in later phases. The entry point is `uv run scripts/fetch_transcripts.py`.

## Risks / Trade-offs

- **YouTube API changes** → Both `youtube-transcript-api` and `yt-dlp` are unofficial. Caption endpoints may break. Mitigation: pin dependency versions, surface clear error messages.
- **Auto-generated Malayalam captions may be low quality** → This is a YouTube limitation, not something we can fix. Mitigation: store the `is_generated` flag in metadata so downstream consumers can filter.
- **Rate limiting** → Fetching many videos in sequence could trigger rate limits. Mitigation: no aggressive parallelism; sequential processing with brief implicit delays from network I/O is sufficient for typical playlist sizes (50–200 videos).
- **Missing captions** → Some Sancharam videos may lack Malayalam captions entirely. Mitigation: skip gracefully, log to stderr, and produce a summary at the end.
