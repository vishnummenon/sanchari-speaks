# /// script
# dependencies = ["youtube-transcript-api", "yt-dlp"]
# requires-python = ">=3.10"
# ///
"""Extract Malayalam transcripts from Sancharam YouTube videos.

Usage:
    uv run scripts/fetch_transcripts.py URL [URL ...]
    uv run scripts/fetch_transcripts.py --output-dir path/to/dir URL [URL ...]
"""
from __future__ import annotations

import argparse
import json
import logging
import re
import subprocess
import sys
from dataclasses import asdict, dataclass, field
from pathlib import Path
from typing import Any
from urllib.parse import parse_qs, urlparse

from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import TranscriptsDisabled, VideoUnavailable

logger = logging.getLogger(__name__)

LANGUAGE_CODE = "ml"
DEFAULT_OUTPUT_DIR = Path("data/transcripts")
PLAYLIST_PATTERN = re.compile(r"[?&]list=")


# ---------------------------------------------------------------------------
# Data structures
# ---------------------------------------------------------------------------

@dataclass
class Segment:
    start: float
    duration: float
    text: str


@dataclass
class TranscriptResult:
    video_id: str
    title: str
    url: str
    language: str
    is_generated: bool
    transcript_raw: str
    segments: list[Segment] = field(default_factory=list)

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


# ---------------------------------------------------------------------------
# URL helpers
# ---------------------------------------------------------------------------

def is_playlist_url(url: str) -> bool:
    return bool(PLAYLIST_PATTERN.search(url))


def extract_video_id(url: str) -> str | None:
    parsed = urlparse(url)
    if parsed.hostname in ("youtu.be",):
        return parsed.path.lstrip("/")
    if parsed.hostname in ("www.youtube.com", "youtube.com", "m.youtube.com"):
        if parsed.path == "/watch":
            qs = parse_qs(parsed.query)
            return qs.get("v", [None])[0]
        if parsed.path.startswith(("/embed/", "/v/", "/shorts/")):
            return parsed.path.split("/")[2]
    return None


def resolve_playlist(url: str) -> list[tuple[str, str]]:
    """Resolve a playlist URL to a list of (video_id, title) tuples."""
    try:
        result = subprocess.run(
            ["yt-dlp", "--flat-playlist", "--dump-json", "--no-warnings", url],
            capture_output=True, text=True, timeout=120,
        )
    except subprocess.TimeoutExpired:
        logger.error("Timed out resolving playlist: %s", url)
        return []

    if result.returncode != 0:
        logger.error("Failed to resolve playlist %s: %s", url, result.stderr.strip())
        return []

    videos = []
    for line in result.stdout.strip().splitlines():
        try:
            entry = json.loads(line)
            vid = entry.get("id", "")
            title = entry.get("title", vid)
            if vid:
                videos.append((vid, title))
        except json.JSONDecodeError:
            continue

    logger.info("Resolved %d videos from playlist: %s", len(videos), url)
    return videos


def fetch_video_title(video_id: str) -> str:
    """Fetch video title via yt-dlp. Falls back to video_id on failure."""
    try:
        result = subprocess.run(
            ["yt-dlp", "--skip-download", "--print", "title", "--no-warnings",
             f"https://www.youtube.com/watch?v={video_id}"],
            capture_output=True, text=True, timeout=30,
        )
        title = result.stdout.strip()
        if result.returncode == 0 and title:
            return title
    except (subprocess.TimeoutExpired, Exception):
        logger.warning("Failed to fetch title for %s", video_id)
    return video_id


# ---------------------------------------------------------------------------
# Transcript extraction
# ---------------------------------------------------------------------------

def fetch_malayalam_transcript(video_id: str) -> tuple[list[dict], bool] | None:
    """Fetch Malayalam transcript. Returns (segments, is_generated) or None."""
    api = YouTubeTranscriptApi()
    try:
        transcript_list = api.list(video_id)
    except (TranscriptsDisabled, VideoUnavailable) as exc:
        logger.warning("Skipping %s: %s", video_id, exc)
        return None

    manual = None
    generated = None
    for transcript in transcript_list:
        if transcript.language_code != LANGUAGE_CODE:
            continue
        if transcript.is_generated:
            generated = transcript
        else:
            manual = transcript

    chosen = manual or generated
    if chosen is None:
        logger.warning("Skipping %s: no Malayalam captions available", video_id)
        return None

    try:
        fetched = chosen.fetch()
        segments = [
            {"start": s.start, "duration": s.duration, "text": s.text}
            for s in fetched
        ]
        return segments, chosen.is_generated
    except Exception as exc:
        logger.warning("Skipping %s: failed to fetch transcript: %s", video_id, exc)
        return None


def build_transcript_result(
    video_id: str, title: str, segments: list[dict], is_generated: bool,
) -> TranscriptResult:
    raw_text = " ".join(seg["text"] for seg in segments)
    return TranscriptResult(
        video_id=video_id,
        title=title,
        url=f"https://www.youtube.com/watch?v={video_id}",
        language=LANGUAGE_CODE,
        is_generated=is_generated,
        transcript_raw=raw_text,
        segments=[Segment(**seg) for seg in segments],
    )


def save_transcript(result: TranscriptResult, output_dir: Path) -> Path:
    output_dir.mkdir(parents=True, exist_ok=True)
    path = output_dir / f"{result.video_id}.json"
    with open(path, "w", encoding="utf-8") as f:
        json.dump(result.to_dict(), f, ensure_ascii=False, indent=2)
    return path


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def collect_videos(urls: list[str]) -> list[tuple[str, str]]:
    """Resolve all URLs to (video_id, title) pairs, expanding playlists."""
    videos: list[tuple[str, str]] = []
    seen: set[str] = set()

    for url in urls:
        if is_playlist_url(url):
            for vid, title in resolve_playlist(url):
                if vid not in seen:
                    seen.add(vid)
                    videos.append((vid, title))
        else:
            vid = extract_video_id(url)
            if vid and vid not in seen:
                seen.add(vid)
                title = fetch_video_title(vid)
                videos.append((vid, title))
            elif not vid:
                logger.warning("Could not extract video ID from URL: %s", url)

    return videos


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Extract Malayalam transcripts from YouTube videos.",
    )
    parser.add_argument("urls", nargs="+", help="YouTube video or playlist URLs")
    parser.add_argument(
        "--output-dir", type=Path, default=DEFAULT_OUTPUT_DIR,
        help=f"Output directory for transcript JSON files (default: {DEFAULT_OUTPUT_DIR})",
    )
    args = parser.parse_args()

    logging.basicConfig(
        level=logging.INFO,
        format="%(levelname)s: %(message)s",
        stream=sys.stderr,
    )

    videos = collect_videos(args.urls)
    if not videos:
        print("No videos to process.", file=sys.stderr)
        sys.exit(1)

    processed = 0
    skipped: list[tuple[str, str]] = []

    for video_id, title in videos:
        result = fetch_malayalam_transcript(video_id)
        if result is None:
            skipped.append((video_id, "no Malayalam captions available"))
            continue

        segments, is_generated = result
        transcript = build_transcript_result(video_id, title, segments, is_generated)
        path = save_transcript(transcript, args.output_dir)
        processed += 1
        logger.info("Saved: %s → %s", video_id, path)

    print(f"\nProcessed: {processed}, Skipped: {len(skipped)}")
    if skipped:
        print("Skipped videos:")
        for vid, reason in skipped:
            print(f"  - {vid}: {reason}")


if __name__ == "__main__":
    main()
