## ADDED Requirements

### Requirement: Accept single video URL
The system SHALL accept a single YouTube video URL as a positional argument and extract its transcript.

#### Scenario: Single URL provided
- **WHEN** the user runs `uv run scripts/fetch_transcripts.py <URL>` with one YouTube video URL
- **THEN** the system extracts the Malayalam transcript for that video and saves it to `data/transcripts/<video_id>.json`

### Requirement: Accept multiple video URLs
The system SHALL accept multiple YouTube video URLs as positional arguments and extract transcripts for each.

#### Scenario: Multiple URLs provided
- **WHEN** the user runs the CLI with multiple YouTube video URLs
- **THEN** the system extracts Malayalam transcripts for each video sequentially and saves each to its own JSON file

### Requirement: Accept playlist URL
The system SHALL detect YouTube playlist URLs, resolve them to individual video URLs using `yt-dlp --flat-playlist`, and extract transcripts for each video in the playlist.

#### Scenario: Playlist URL provided
- **WHEN** the user provides a YouTube playlist URL
- **THEN** the system resolves it to individual video URLs and processes each video

#### Scenario: Mixed playlist and video URLs
- **WHEN** the user provides both playlist URLs and individual video URLs
- **THEN** the system resolves all playlists and processes all videos (from playlists and individual URLs combined)

### Requirement: Create output directory automatically
The system SHALL create the `data/transcripts/` directory if it does not already exist.

#### Scenario: Output directory missing
- **WHEN** the `data/transcripts/` directory does not exist at runtime
- **THEN** the system creates it before writing any transcript files

### Requirement: Summary output on completion
The system SHALL print a summary to stdout after processing all videos, indicating the number of videos processed successfully and the number skipped.

#### Scenario: Mixed success and failure
- **WHEN** some videos are processed and some are skipped
- **THEN** the system prints a summary line like "Processed: 8, Skipped: 2" and lists skipped video IDs with reasons

### Requirement: Custom output directory
The system SHALL accept an optional `--output-dir` flag to override the default `data/transcripts/` output directory.

#### Scenario: Custom output directory specified
- **WHEN** the user provides `--output-dir /path/to/custom`
- **THEN** transcript JSON files are saved to the specified directory instead of the default
