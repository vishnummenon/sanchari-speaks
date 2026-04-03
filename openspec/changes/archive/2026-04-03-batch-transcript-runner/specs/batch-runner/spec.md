## ADDED Requirements

### Requirement: URL list file format
The file `data/video_urls.txt` SHALL contain one YouTube URL per line. Lines starting with `#` SHALL be treated as comments and ignored. Blank lines SHALL be ignored.

#### Scenario: Standard URL list
- **WHEN** the file contains a mix of URLs, comments, and blank lines
- **THEN** the runner extracts only the non-empty, non-comment lines as URLs

#### Scenario: File does not exist
- **WHEN** `data/video_urls.txt` does not exist
- **THEN** the runner exits with an error message indicating the file is missing

### Requirement: Idempotent processing
The runner SHALL skip any video whose transcript JSON file already exists in the output directory (`data/transcripts/<video_id>.json`). Only videos without an existing transcript file SHALL be passed to `fetch_transcripts.py`.

#### Scenario: All videos already processed
- **WHEN** every URL in the list has a corresponding transcript file
- **THEN** the runner prints that there are no new videos to process and exits successfully

#### Scenario: Some videos already processed
- **WHEN** 3 of 5 URLs have existing transcript files
- **THEN** the runner passes only the 2 unprocessed URLs to `fetch_transcripts.py`

#### Scenario: No videos processed yet
- **WHEN** no transcript files exist for any URL in the list
- **THEN** the runner passes all URLs to `fetch_transcripts.py`

### Requirement: Invoke fetch_transcripts.py for unprocessed URLs
The runner SHALL invoke `uv run scripts/fetch_transcripts.py` with all unprocessed URLs in a single subprocess call.

#### Scenario: Batch invocation
- **WHEN** there are unprocessed URLs
- **THEN** the runner calls `uv run scripts/fetch_transcripts.py URL1 URL2 ...` with all unprocessed URLs as arguments

### Requirement: Report processing status
The runner SHALL print a summary before invoking `fetch_transcripts.py` showing total URLs in the list, how many are already processed, and how many will be processed in this run.

#### Scenario: Status summary
- **WHEN** the runner starts
- **THEN** it prints a summary like "Total: 10, Already processed: 7, To process: 3"
