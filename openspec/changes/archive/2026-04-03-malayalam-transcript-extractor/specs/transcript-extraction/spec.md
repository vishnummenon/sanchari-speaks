## ADDED Requirements

### Requirement: Fetch Malayalam transcript for a video
The system SHALL fetch the Malayalam language caption track for a given YouTube video ID using `youtube-transcript-api`. It SHALL prefer manually uploaded captions over auto-generated ones when both are available.

#### Scenario: Video has manual Malayalam captions
- **WHEN** a video has both manual and auto-generated Malayalam captions
- **THEN** the system fetches the manual caption track

#### Scenario: Video has only auto-generated Malayalam captions
- **WHEN** a video has only auto-generated Malayalam captions
- **THEN** the system fetches the auto-generated caption track

#### Scenario: Video has no Malayalam captions
- **WHEN** a video has no Malayalam caption track (neither manual nor auto-generated)
- **THEN** the system skips the video and logs the video ID and reason ("no Malayalam captions available") to stderr

### Requirement: Structure transcript as JSON with metadata
The system SHALL save each transcript as a JSON file containing: `video_id` (string), `title` (string), `url` (string), `language` (string, e.g. "ml"), `is_generated` (boolean), `transcript_raw` (string — all segment text concatenated with spaces), and `segments` (array of objects with `start`, `duration`, and `text` fields).

#### Scenario: Successful transcript extraction
- **WHEN** a Malayalam transcript is successfully fetched for a video
- **THEN** the system writes a JSON file to `data/transcripts/<video_id>.json` with all required metadata fields and both raw text and timestamped segments

#### Scenario: Output file already exists
- **WHEN** a JSON file for the video ID already exists in the output directory
- **THEN** the system overwrites it with the new transcript data

### Requirement: Fetch video metadata
The system SHALL retrieve the video title for each video using `yt-dlp` metadata extraction (without downloading media).

#### Scenario: Video title retrieval
- **WHEN** extracting a transcript for a video
- **THEN** the output JSON includes the video's title as returned by `yt-dlp`

#### Scenario: Title retrieval fails
- **WHEN** the system cannot fetch the video title
- **THEN** the system uses the video ID as the title fallback and continues processing
