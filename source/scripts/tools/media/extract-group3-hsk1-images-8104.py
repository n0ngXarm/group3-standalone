#!/usr/bin/env python3
"""Extract scene images for HSK1 lessons (Group 3, 8104) from hsk1-2.pdf.

Each scene uses a full-width 16:9 band of its dialogue page. Visually verified
scenes use explicit crop boxes; older scenes retain the saturated-band
fallback. Use ``--lesson`` to regenerate a narrow lesson subset. Outputs:
  public/assets/group3/lessons/hsk1/lesson-NN/scenes/scene-NN-1400w.webp
  public/assets/group3/lessons/hsk1/lesson-NN/scenes/scene-NN-720w.webp
"""

from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[2]
PDF = ROOT / "docs/references/hsk/sources/hsk1-2.pdf"
OUT = ROOT / "apps/frontend/public/assets/group3"

# (pdf_page, lesson_label, scene_key)
SCENES = [
    (17, "hsk1-l1", "office"),
    (18, "hsk1-l1", "classroom"),
    (19, "hsk1-l1", "farewell"),
    (22, "hsk1-l2", "classroom"),
    (23, "hsk1-l2", "campus"),
    (24, "hsk1-l2", "firstmeet"),
    (26, "hsk1-l3", "campus"),
    (28, "hsk1-l3", "photos"),
    (30, "hsk1-l3", "videocall"),
    (35, "hsk1-l4", "home"),
    (38, "hsk1-l4", "company"),
    (40, "hsk1-l4", "street"),
    (44, "hsk1-l5", "home"),
    (46, "hsk1-l5", "cooking"),
    (48, "hsk1-l5", "computer"),
    (52, "hsk1-l6", "number"),
    (53, "hsk1-l6", "supermarket"),
    (55, "hsk1-l6", "family"),
    (62, "hsk1-l7", "time"),
    (65, "hsk1-l7", "cinema"),
    (67, "hsk1-l7", "evening"),
    (71, "hsk1-l8", "cat"),
    (73, "hsk1-l8", "bookstore"),
    (75, "hsk1-l8", "hospital"),
    (78, "hsk1-l9", "front"),
    (81, "hsk1-l9", "book"),
    (82, "hsk1-l9", "saturday"),
    (95, "hsk1-l11", "taxi"),
    (97, "hsk1-l11", "restaurant"),
    (99, "hsk1-l11", "brother"),
    (103, "hsk1-l12", "weather"),
    (105, "hsk1-l12", "elevator"),
    (107, "hsk1-l12", "doctor"),
    (120, "hsk1-l14", "train"),
    (123, "hsk1-l14", "classroom"),
    (125, "hsk1-l14", "family"),
    (129, "hsk1-l15", "meal"),
    (131, "hsk1-l15", "travel"),
    (133, "hsk1-l15", "airport"),
]


def canonical_scene_paths(lesson_label: str, scene_index: int) -> tuple[Path, Path]:
    lesson_number = int(lesson_label.rsplit("l", 1)[1])
    scene_root = OUT / "lessons" / "hsk1" / f"lesson-{lesson_number:02d}" / "scenes"
    return (
        scene_root / f"scene-{scene_index:02d}-1400w.webp",
        scene_root / f"scene-{scene_index:02d}-720w.webp",
    )

BAND_W = 1636
BAND_H = 920  # 16:9 of full page width
TARGET = (1400, 788)
TARGET_SMALL = (720, 405)

SAT_THRESHOLD = 40.0

# Crop boxes are in the 200 dpi rendered-page coordinate space. These nine
# boxes were checked against the rendered dialogue pages so each image shows
# the scene's speakers/dialogue and, where present, its supporting photograph.
EXPLICIT_CROPS = {
    (103, "hsk1-l12", "weather"): (0, 833, 1636, 1753),
    (105, "hsk1-l12", "elevator"): (0, 817, 1636, 1737),
    (107, "hsk1-l12", "doctor"): (0, 183, 1636, 1103),
    (120, "hsk1-l14", "train"): (0, 833, 1636, 1753),
    (123, "hsk1-l14", "classroom"): (0, 167, 1636, 1087),
    (125, "hsk1-l14", "family"): (0, 183, 1636, 1103),
    (129, "hsk1-l15", "meal"): (0, 833, 1636, 1753),
    (131, "hsk1-l15", "travel"): (0, 133, 1636, 1053),
    (133, "hsk1-l15", "airport"): (0, 100, 1636, 1020),
}


def top_photo_band_start(sat: np.ndarray, height: int) -> int | None:
    """Find the y where the topmost saturated (photo) region begins."""
    best = None
    y = 0
    while y < height - 120:
        band = sat[y : y + 120]
        if float(band.mean()) > SAT_THRESHOLD:
            if best is None:
                best = y
        elif best is not None:
            return best
        y += 120
    return best


def render_page(page: int) -> Image.Image:
    import subprocess

    tmp = Path("/tmp/opencode/imgt")
    tmp.mkdir(parents=True, exist_ok=True)
    png = tmp / f"h1-{page:03d}.png"
    subprocess.run(
        ["pdftoppm", "-png", "-r", "200", "-f", str(page), "-l", str(page), "-singlefile", str(PDF), str(png.with_suffix(""))],
        check=True,
    )
    return Image.open(png).convert("RGB")


def save_webp(img: Image.Image, path: Path) -> None:
    img.save(path, "WEBP", quality=82, method=6)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--lesson",
        action="append",
        choices=sorted({label for _, label, _ in SCENES}),
        help="Regenerate only this lesson label; repeat for multiple lessons.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    selected_lessons = set(args.lesson or [])
    OUT.mkdir(parents=True, exist_ok=True)
    rendered: dict[int, Image.Image] = {}
    scene_counts: dict[str, int] = {}
    for pdf_page, label, scene in SCENES:
        scene_counts[label] = scene_counts.get(label, 0) + 1
        scene_index = scene_counts[label]
        if selected_lessons and label not in selected_lessons:
            continue
        if pdf_page not in rendered:
            im = render_page(pdf_page)
            rendered[pdf_page] = im
        page = rendered[pdf_page]
        crop_key = (pdf_page, label, scene)
        crop_box = EXPLICIT_CROPS.get(crop_key)
        if crop_box is None:
            h = page.height
            hsv = ImageOps.grayscale(page.convert("HSV").getchannel("S"))
            sat = np.asarray(hsv, dtype=np.float32)
            start = top_photo_band_start(sat, h)
            y0 = 0 if start is None else max(0, start - 40)
            y0 = min(y0, h - BAND_H)
            crop_box = (0, y0, BAND_W, y0 + BAND_H)
            crop_method = f"auto sat_start={start}"
        else:
            crop_method = "explicit"
        band = page.crop(crop_box)
        full = band.resize(TARGET, Image.LANCZOS)
        small = band.resize(TARGET_SMALL, Image.LANCZOS)
        full_path, small_path = canonical_scene_paths(label, scene_index)
        full_path.parent.mkdir(parents=True, exist_ok=True)
        save_webp(full, full_path)
        save_webp(small, small_path)
        print(f"{label}/{scene}: {full_path.relative_to(OUT)} crop={crop_box} method={crop_method}")


if __name__ == "__main__":
    main()
