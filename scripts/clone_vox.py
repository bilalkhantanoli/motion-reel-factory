#!/usr/bin/env python3
"""clone_vox.py - Clone your voice using VoxCPM2 (free, local, Apache-2.0).
Best for English and Hinglish words.

Usage:
  python scripts/clone_vox.py --script script.txt --ref me.wav --prompt-text me.txt --out public/vo.wav
"""
import argparse
import sys
from pathlib import Path


def main():
    parser = argparse.ArgumentParser(description="Voice cloning with VoxCPM2")
    parser.add_argument("--script", default="script.txt", help="Path to text script to speak")
    parser.add_argument("--ref", default="me.wav", help="10-20 sec reference recording of your voice")
    parser.add_argument("--prompt-text", default="me.txt", help="Text transcript of what you said in me.wav")
    parser.add_argument("--out", default="public/vo.wav", help="Output audio path (default: public/vo.wav)")
    parser.add_argument("--device", default="mps", choices=["mps", "cuda", "cpu"], help="Hardware device (default: mps for Mac)")
    args = parser.parse_args()

    for path, desc in [(args.script, "Script"), (args.ref, "Reference audio"), (args.prompt_text, "Prompt transcript")]:
        if not Path(path).exists():
            print(f"Error: {desc} file not found at '{path}'", file=sys.stderr)
            return 1

    try:
        import soundfile as sf
        from voxcpm import VoxCPM
    except ImportError:
        print("Missing dependencies. Run:\n  pip install voxcpm soundfile", file=sys.stderr)
        return 1

    print(f"Loading VoxCPM2 on {args.device}...")
    model = VoxCPM.from_pretrained("openbmb/VoxCPM2", load_denoiser=False, optimize=False, device=args.device)

    script_text = Path(args.script).read_text(encoding="utf-8").strip()
    prompt_text = Path(args.prompt_text).read_text(encoding="utf-8").strip()

    print("Generating speech...")
    wav = model.generate(
        text=script_text,
        reference_wav_path=args.ref,
        prompt_wav_path=args.ref,
        prompt_text=prompt_text,
        cfg_value=2.0,
        inference_timesteps=10,
    )

    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    sf.write(str(out_path), wav, model.tts_model.sample_rate)
    print(f"Audio generated successfully at: {out_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
