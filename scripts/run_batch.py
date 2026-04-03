# /// script
# requires-python = ">=3.10"
# ///
"""Batch runner for fetch_transcripts.py — idempotent.

Reads data/video_urls.txt, skips videos already in data/transcripts/,
and invokes fetch_transcripts.py for the rest.

Usage:
    uv run scripts/run_batch.py
"""
from __future__ import annotations

import subprocess
import sys
from pathlib import Path
from urllib.parse import parse_qs, urlparse

URLS_FILE = Path("data/video_urls.txt")
TRANSCRIPTS_DIR = Path("data/transcripts")


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


def read_url_list(path: Path) -> list[str]:
    urls = []
    for line in path.read_text().splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("#"):
            continue
        urls.append(stripped)
    return urls


def main() -> None:
    if not URLS_FILE.exists():
        print(f"Error: {URLS_FILE} not found.", file=sys.stderr)
        sys.exit(1)

    urls = read_url_list(URLS_FILE)
    if not urls:
        print("No URLs found in the list.")
        return

    # Determine which are already processed
    unprocessed = []
    for url in urls:
        vid = extract_video_id(url)
        if vid and (TRANSCRIPTS_DIR / f"{vid}.json").exists():
            continue
        unprocessed.append(url)

    already = len(urls) - len(unprocessed)
    print(f"Total: {len(urls)}, Already processed: {already}, To process: {len(unprocessed)}")

    if not unprocessed:
        print("Nothing new to process.")
        return

    subprocess.run(
        ["uv", "run", "scripts/fetch_transcripts.py", *unprocessed],
        check=False,
    )


if __name__ == "__main__":
    main()
