#!/usr/bin/env python3
"""audio_loudness.py - Computes normalized per-frame mouth loudness (0.0 to 1.0)
from an audio file (e.g. public/vo.wav) at 30 fps, and outputs public/loudness.json.
"""
import argparse
import json
import math
import sys
import wave
from pathlib import Path


def calculate_loudness(wav_path: Path, fps: int = 30) -> list[float]:
    with wave.open(str(wav_path), "rb") as wf:
        n_channels = wf.getnchannels()
        sampwidth = wf.getsampwidth()
        framerate = wf.getframerate()
        n_frames = wf.getnframes()
        raw_bytes = wf.readframes(n_frames)

    # Decode bytes
    if sampwidth == 2:
        import array
        samples = array.array("h", raw_bytes)
    else:
        print(f"Unsupported sample width: {sampwidth}", file=sys.stderr)
        return []

    # If stereo, average channels
    if n_channels == 2:
        mono_samples = [(samples[i] + samples[i + 1]) / 2 for i in range(0, len(samples), 2)]
    else:
        mono_samples = list(samples)

    samples_per_video_frame = framerate / fps
    total_video_frames = math.ceil(len(mono_samples) / samples_per_video_frame)

    rms_values = []
    for f in range(total_video_frames):
        start_idx = int(f * samples_per_video_frame)
        end_idx = min(len(mono_samples), int((f + 1) * samples_per_video_frame))
        slice_samples = mono_samples[start_idx:end_idx]
        if not slice_samples:
            rms_values.append(0.0)
            continue
        sum_sq = sum(s * s for s in slice_samples)
        rms = math.sqrt(sum_sq / len(slice_samples))
        rms_values.append(rms)

    max_rms = max(rms_values) if rms_values else 1.0
    if max_rms == 0:
        max_rms = 1.0

    # Normalize to 0.0 - 1.0 with noise threshold and compression
    loudness = []
    for r in rms_values:
        ratio = r / max_rms
        if ratio < 0.05:
            val = 0.0
        else:
            # logarithmic/smooth mapping
            val = min(1.0, math.pow(ratio, 0.7) * 1.2)
        loudness.append(round(val, 3))

    return loudness


def main():
    parser = argparse.ArgumentParser(description="Calculate audio loudness per video frame")
    parser.add_argument("audio", nargs="?", default="public/vo.wav", help="Path to input WAV file")
    parser.add_argument("-o", "--out", default="public/loudness.json", help="Output JSON path")
    parser.add_argument("--fps", type=int, default=30, help="Video frames per second (default 30)")
    args = parser.parse_args()

    audio_path = Path(args.audio)
    if not audio_path.exists():
        print(f"Audio file '{audio_path}' not found.", file=sys.stderr)
        return 1

    loudness = calculate_loudness(audio_path, fps=args.fps)
    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(loudness, indent=2), encoding="utf-8")
    print(f"Wrote {len(loudness)} loudness frames to {out_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
