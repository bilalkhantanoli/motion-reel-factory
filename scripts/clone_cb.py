#!/usr/bin/env python3
"""clone_cb.py - Clone your voice using Chatterbox Multilingual Hindi (free, local, MIT).
Best for clean Hindi and Hinglish voiceovers.

Usage:
  python scripts/clone_cb.py --script script.txt --ref me.wav --out public/vo.wav
"""
import argparse
import re
import sys
from pathlib import Path


def main():
    parser = argparse.ArgumentParser(description="Voice cloning with Chatterbox Hindi")
    parser.add_argument("--script", default="script.txt", help="Path to text script to speak")
    parser.add_argument("--ref", default="me.wav", help="10-20 sec reference recording of your voice")
    parser.add_argument("--out", default="public/vo.wav", help="Output audio path (default: public/vo.wav)")
    parser.add_argument("--device", default="mps", choices=["mps", "cuda", "cpu"], help="Hardware device (default: mps for Mac)")
    args = parser.parse_args()

    for path, desc in [(args.script, "Script"), (args.ref, "Reference audio")]:
        if not Path(path).exists():
            print(f"Error: {desc} file not found at '{path}'", file=sys.stderr)
            return 1

    try:
        import torch
        import torchaudio as ta
        from huggingface_hub import hf_hub_download, snapshot_download
        from chatterbox.mtl_tts import ChatterboxMultilingualTTS
    except ImportError:
        print("Missing dependencies. Run:\n  pip install chatterbox-tts 'setuptools<81'", file=sys.stderr)
        return 1

    local_dir = Path("cb-hi")
    print(f"Downloading/loading Chatterbox Hindi model files to {local_dir}...")
    snapshot_download(
        "ResembleAI/chatterbox",
        local_dir=str(local_dir),
        allow_patterns=["ve.pt", "s3gen.pt", "conds.pt", "grapheme_mtl_merged_expanded_v1.json"],
    )
    hf_hub_download("ResembleAI/Chatterbox-Multilingual-hi", "t3_hi.safetensors", local_dir=str(local_dir))

    print(f"Initializing model on {args.device}...")
    model = ChatterboxMultilingualTTS.from_local(str(local_dir), args.device, t3_model="t3_hi.safetensors")

    text = Path(args.script).read_text(encoding="utf-8").strip()
    parts = [s for s in re.split(r"(?<=[।.?!])\s+", text) if s]
    print(f"Synthesizing {len(parts)} sentence chunk(s)...")

    out = []
    for i, s in enumerate(parts):
        torch.manual_seed(42 + i)
        chunk = model.generate(
            s,
            language_id="hi",
            audio_prompt_path=args.ref,
            exaggeration=0.5,
            cfg_weight=0.3,
        ).cpu()
        out.append(chunk)
        # Small 60ms gap between sentences
        out.append(torch.zeros(1, int(model.sr * 0.06)))

    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    ta.save(str(out_path), torch.cat(out, dim=1), model.sr)
    print(f"Chatterbox audio generated successfully at: {out_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
