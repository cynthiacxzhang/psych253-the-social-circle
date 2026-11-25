#!/usr/bin/env python3
"""Generate print-ready QR codes for The Social Circle.

Usage:
    python tools/make_qr.py https://your-final-url.example/

Writes social-circle-qr.svg and social-circle-qr.png to tools/qr-output/
(or --out DIR). Plain black modules on white with a 4-module quiet zone.
"""
import argparse
import sys
from pathlib import Path
from urllib.parse import urlparse

import segno

BLOCKED_HOSTS = {"localhost", "127.0.0.1", "0.0.0.0", "::1"}


def check_url(url: str) -> str:
    parts = urlparse(url)
    host = (parts.hostname or "").lower()
    if parts.scheme != "https" or not host:
        sys.exit("Error: use the final deployed https:// URL.")
    if host in BLOCKED_HOSTS or host.endswith(".local") or host.startswith("192.168."):
        sys.exit("Error: that looks like a local preview address, not the final deployed URL.")
    return url


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("url", help="Final deployed HTTPS URL")
    parser.add_argument("--out", default=Path(__file__).parent / "qr-output", type=Path, help="Output folder")
    args = parser.parse_args()

    url = check_url(args.url.strip())
    args.out.mkdir(parents=True, exist_ok=True)

    qr = segno.make(url, error="m", micro=False)
    svg = args.out / "social-circle-qr.svg"
    png = args.out / "social-circle-qr.png"
    # border=4 is the standard quiet zone. PNG at 600 dpi with 20 px per module.
    qr.save(svg, scale=10, border=4, dark="#000000", light="#ffffff", xmldecl=False)
    qr.save(png, scale=20, border=4, dark="#000000", light="#ffffff", dpi=600)

    size_px = (qr.symbol_size(scale=20, border=4))[0]
    print(f"Encoded: {url}")
    print(f"QR version {qr.version}, error correction {qr.error}")
    print(f"Wrote {svg}")
    print(f"Wrote {png} ({size_px}x{size_px} px, about {size_px / 600 * 2.54:.1f} cm wide at 600 dpi)")
    print("Print the URL in text beside the code, and test-scan a printed copy.")


if __name__ == "__main__":
    main()
