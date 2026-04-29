#!/usr/bin/env python3
"""
Voice message transcription using faster-whisper.
Usage: python3 transcribe.py <audio_file>
"""

import sys
import os

def transcribe(audio_path: str) -> str:
    from faster_whisper import WhisperModel
    model = WhisperModel("base", device="cpu", compute_type="int8")
    segments, _ = model.transcribe(audio_path)
    return " ".join([s.text.strip() for s in segments])

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: transcribe.py <audio_file>")
        sys.exit(1)
    path = sys.argv[1]
    if not os.path.exists(path):
        print(f"File not found: {path}")
        sys.exit(1)
    print(transcribe(path))
