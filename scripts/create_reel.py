#!/usr/bin/env python3
"""create_reel.py - Prompt-Driven Reel Factory Generator.
Generates voiceover, word timestamps, audio loudness, updates brand config,
and creates the dynamic reel specification from a single command or prompt.

Usage Examples:
  # 1. Simple topic (uses existing or default brand)
  python3 scripts/create_reel.py --topic "How Kubernetes Pods Work"

  # 2. Complete prompt with custom branding, colors, and character
  python3 scripts/create_reel.py \
    --topic "How Linux System Calls Work" \
    --handle "@bilalaziztanoli" \
    --bg-color "#0D1117" \
    --accent-color "#58A6FF" \
    --accent2-color "#39D353" \
    --char-color "#58A6FF"
"""
import argparse
import asyncio
import json
import math
import os
import subprocess
import sys
from pathlib import Path


def load_or_update_brand(args) -> dict:
    config_path = Path("brand.config.json")
    brand = {
        "handle": "@bilalaziztanoli",
        "name": "Bilal Aziz Tanoli",
        "font": "Inter",
        "radius": 32,
        "shadow": True,
        "colors": {
            "bg": "#0D1117",
            "surface": "#161B22",
            "text": "#F0F6FC",
            "accent": "#58A6FF",
            "accent2": "#39D353",
        },
        "character": {
            "primaryColor": "#58A6FF",
            "faceColor": "#0D1117",
            "antennaColor": "#39D353",
            "size": 290,
        },
    }

    if config_path.exists():
        try:
            brand = json.loads(config_path.read_text(encoding="utf-8"))
        except Exception:
            pass

    # Override with command-line / prompt arguments if provided
    if args.handle:
        brand["handle"] = args.handle if args.handle.startswith("@") else f"@{args.handle}"
    if args.name:
        brand["name"] = args.name
    if args.bg_color:
        brand["colors"]["bg"] = args.bg_color
    if args.surface_color:
        brand["colors"]["surface"] = args.surface_color
    if args.accent_color:
        brand["colors"]["accent"] = args.accent_color
    if args.accent2_color:
        brand["colors"]["accent2"] = args.accent2_color

    if args.char_color:
        brand["character"]["primaryColor"] = args.char_color
    if args.char_face:
        brand["character"]["faceColor"] = args.char_face
    if args.char_antenna:
        brand["character"]["antennaColor"] = args.char_antenna
    if args.char_size:
        brand["character"]["size"] = args.char_size

    # Save updated config
    config_path.write_text(json.dumps(brand, indent=2), encoding="utf-8")
    return brand


def build_script_and_phases(topic: str, handle: str, custom_script: str = None) -> tuple[str, list[dict]]:
    """Builds a structured 4-phase narrative script and visual storyboard for any topic."""
    words_topic = topic.strip().split()
    short_topic = " ".join(words_topic[:4])

    if custom_script:
        script_text = custom_script.strip()
    else:
        script_text = (
            f"How does {topic} actually work under the hood? "
            f"Here is what you need to know. "
            f"Why is it so powerful? "
            f"Number 1: Execution Efficiency. It eliminates computational bottlenecks with optimized design. "
            f"Number 2: Scalable Architecture. Non-blocking asynchronous processing handles high throughput effortlessly. "
            f"How does it operate? "
            f"Step 1: Low-level data structures enable microsecond lookups. "
            f"Step 2: Event-driven workflows prevent latency spikes across client connections. "
            f"Understanding these internals is what separates junior coders from senior engineers. "
            f"Follow {handle.replace('@', '')} for more daily tech breakdowns!"
        )

    phases = [
        {
            "id": "hook",
            "characterExpression": "thinking",
            "title": topic,
            "highlight": words_topic[-1] if words_topic else "Explained",
            "cardHeading": "Under The Hood",
            "cardText": f"How does {topic} work when you look beneath the surface?",
            "sticker": "System Internals",
            "stickerRotate": -6,
        },
        {
            "id": "why_important",
            "characterExpression": "surprised",
            "title": "Why Is It Important?",
            "highlight": "Important?",
            "bigNumbers": [
                {
                    "num": 1,
                    "heading": "Execution Efficiency",
                    "text": "Optimized memory layouts eliminate computational bottlenecks.",
                },
                {
                    "num": 2,
                    "heading": "Scalable Architecture",
                    "text": "Asynchronous event loops handle high throughput effortlessly.",
                },
            ],
            "sticker": "High Performance",
            "stickerRotate": 7,
        },
        {
            "id": "how_it_works",
            "characterExpression": "excited",
            "title": "How It Operates",
            "highlight": "Operates",
            "cardHeading": "Step 1 · Core Mechanisms",
            "cardText": f"Low-level data structures enable microsecond response times for {short_topic}.",
            "subCardHeading": "Step 2 · Event-Driven I/O",
            "subCardText": "Non-blocking dispatch prevents latency spikes under heavy concurrent load.",
            "sticker": "Core Engine",
            "stickerRotate": -7,
        },
        {
            "id": "outro",
            "characterExpression": "wink",
            "title": "Engineering Superpower",
            "highlight": "Superpower",
            "cardHeading": "Master The Internals",
            "cardText": "Deep system knowledge is what separates junior devs from senior engineers.",
            "isOutro": True,
            "sticker": f"Follow {handle}",
            "stickerRotate": 5,
        },
    ]

    return script_text, phases


async def synthesize_speech(script_text: str, voice: str, rate: str):
    import edge_tts

    print(f"🎙️ Synthesizing voiceover with {voice} (rate: {rate})...")
    communicate = edge_tts.Communicate(script_text, voice, rate=rate)
    sentences = []

    out_mp3 = Path("public/vo.mp3")
    out_mp3.parent.mkdir(parents=True, exist_ok=True)

    with open(out_mp3, "wb") as f:
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                f.write(chunk["data"])
            elif chunk["type"] == "SentenceBoundary":
                start_sec = round(chunk["offset"] / 10_000_000, 3)
                duration_sec = round(chunk["duration"] / 10_000_000, 3)
                sentences.append(
                    {
                        "text": chunk["text"],
                        "start": start_sec,
                        "duration": duration_sec,
                        "end": round(start_sec + duration_sec, 3),
                    }
                )

    words = []
    for s in sentences:
        s_words = s["text"].split()
        if not s_words:
            continue
        total_len = sum(max(1, len(w)) for w in s_words)
        curr = s["start"]
        effective_dur = max(0.2, s["duration"] - 0.04)
        for w in s_words:
            w_dur = max(0.18, (len(w) / total_len) * effective_dur)
            words.append(
                {
                    "word": w,
                    "start": round(curr, 2),
                    "end": round(curr + w_dur, 2),
                }
            )
            curr += w_dur

    Path("public/words.json").write_text(json.dumps(words, indent=2), encoding="utf-8")
    return sentences, words


def calculate_loudness(wav_path: Path, fps: int = 30) -> list[float]:
    import wave
    import array

    with wave.open(str(wav_path), "rb") as wf:
        n_channels = wf.getnchannels()
        sampwidth = wf.getsampwidth()
        framerate = wf.getframerate()
        n_frames = wf.getnframes()
        raw_bytes = wf.readframes(n_frames)

    samples = array.array("h" if sampwidth == 2 else "b", raw_bytes)
    if n_channels == 2:
        mono_samples = [(samples[i] + samples[i + 1]) / 2 for i in range(0, len(samples), 2)]
    else:
        mono_samples = list(samples)

    spf = framerate / fps
    total_frames = math.ceil(len(mono_samples) / spf)
    rms_vals = []
    for f in range(total_frames):
        s_idx = int(f * spf)
        e_idx = min(len(mono_samples), int((f + 1) * spf))
        sl = mono_samples[s_idx:e_idx]
        if not sl:
            rms_vals.append(0.0)
            continue
        rms = math.sqrt(sum(x * x for x in sl) / len(sl))
        rms_vals.append(rms)

    max_r = max(rms_vals) if rms_vals else 1.0
    if max_r == 0:
        max_r = 1.0

    loudness = []
    for r in rms_vals:
        ratio = r / max_r
        val = 0.0 if ratio < 0.05 else min(1.0, math.pow(ratio, 0.7) * 1.2)
        loudness.append(round(val, 3))
    return loudness


def main():
    parser = argparse.ArgumentParser(description="Create a dynamic reel from user prompt")
    parser.add_argument("--topic", required=True, help="Topic of the reel")
    parser.add_argument("--script-text", help="Custom voiceover script text")
    parser.add_argument("--script-file", help="Path to custom voiceover script file")
    parser.add_argument("--handle", help="Creator brand handle, e.g. @bilalaziztanoli")
    parser.add_argument("--name", help="Creator display name")
    parser.add_argument("--bg-color", help="Background color hex")
    parser.add_argument("--surface-color", help="Cards surface color hex")
    parser.add_argument("--accent-color", help="Primary accent color hex")
    parser.add_argument("--accent2-color", help="Secondary accent color hex")
    parser.add_argument("--char-color", help="Character body color hex")
    parser.add_argument("--char-face", help="Character screen/face color hex")
    parser.add_argument("--char-antenna", help="Character antenna color hex")
    parser.add_argument("--char-size", type=int, help="Character size in pixels")
    parser.add_argument("--voice", default="en-US-GuyNeural", help="TTS voice name (default: en-US-GuyNeural)")
    parser.add_argument("--rate", default="+4%", help="TTS speech rate (default: +4%)")
    args = parser.parse_args()

    # 1. Update & Load Brand Configuration
    brand = load_or_update_brand(args)
    handle = brand.get("handle", "@bilalaziztanoli")

    # 2. Prepare Script Text
    custom_script = None
    if args.script_text:
        custom_script = args.script_text
    elif args.script_file and Path(args.script_file).exists():
        custom_script = Path(args.script_file).read_text(encoding="utf-8").strip()

    script_text, phases = build_script_and_phases(args.topic, handle, custom_script)

    print(f"\n==========================================")
    print(f"🎬 Creating Reel: {args.topic}")
    print(f"👤 Brand Handle: {handle}")
    print(f"🎨 Theme: Accent {brand['colors']['accent']}, Character {brand['character']['primaryColor']}")
    print(f"==========================================\n")

    # 3. Synthesize Speech & Word Timestamps
    sentences, words = asyncio.run(synthesize_speech(script_text, args.voice, args.rate))
    total_dur = sentences[-1]["end"] if sentences else 36.0
    total_frames = math.ceil((total_dur + 0.6) * 30)

    # 4. Convert MP3 to WAV & Extract Loudness
    subprocess.run(["afconvert", "-f", "WAVE", "-d", "LEI16", "public/vo.mp3", "public/vo.wav"], check=True)
    loudness = calculate_loudness(Path("public/vo.wav"), fps=30)
    Path("public/loudness.json").write_text(json.dumps(loudness, indent=2), encoding="utf-8")

    # 5. Distribute Phase Timings
    q1 = total_dur * 0.16
    q2 = total_dur * 0.52
    q3 = total_dur * 0.80

    phases[0]["startSec"] = 0.0
    phases[0]["endSec"] = round(q1, 1)

    phases[1]["startSec"] = round(q1, 1)
    phases[1]["endSec"] = round(q2, 1)
    if "bigNumbers" in phases[1]:
        phases[1]["bigNumbers"][0]["atSec"] = round(q1 + 1.2, 1)
        phases[1]["bigNumbers"][1]["atSec"] = round(q1 + (q2 - q1) / 2 + 0.5, 1)

    phases[2]["startSec"] = round(q2, 1)
    phases[2]["endSec"] = round(q3, 1)
    phases[2]["subCardAtSec"] = round(q2 + (q3 - q2) / 2, 1)

    phases[3]["startSec"] = round(q3, 1)
    phases[3]["endSec"] = round(total_dur, 1)

    keywords = [w.lower().strip(".,?!") for w in args.topic.split() if len(w) > 3]
    keywords += ["internals", "architecture", "superpower", handle.replace("@", "").lower(), "follow"]

    reel_data = {
        "topic": args.topic,
        "audioFile": "vo.mp3",
        "totalDurationSec": round(total_dur, 2),
        "totalFrames": total_frames,
        "keywords": list(set(keywords)),
        "phases": phases,
    }

    Path("public/reel-data.json").write_text(json.dumps(reel_data, indent=2), encoding="utf-8")

    print(f"✅ Generated voiceover: public/vo.mp3 ({total_dur:.1f}s)")
    print(f"✅ Generated words: public/words.json ({len(words)} words)")
    print(f"✅ Generated loudness: public/loudness.json ({len(loudness)} frames)")
    print(f"✅ Saved active spec: public/reel-data.json ({total_frames} frames)")
    print(f"✅ Brand configuration updated in brand.config.json")
    print(f"\n🚀 Ready to render! Commands:")
    print(f"  npm run preview:character   # preview character expressions & avatar")
    print(f"  npm run still:zones         # verify safe zones")
    print(f"  npm run render              # render out/reel.mp4\n")


if __name__ == "__main__":
    main()
