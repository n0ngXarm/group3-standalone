#!/usr/bin/env python3
"""Extract responsive Group 3 scene images from the HSK2 textbook.

The source is the scanned ``hsk2.pdf`` textbook (not ``hsk2-2.pdf``). Each
mapping identifies the PDF page containing one dialogue photograph and emits
the two 16:9 WebP variants inside that lesson's canonical media directory.
"""

from __future__ import annotations

from pathlib import Path
import subprocess

from PIL import Image


ROOT = Path(__file__).resolve().parents[2]
PDF = ROOT / "docs/references/hsk/sources/hsk2.pdf"
OUT = ROOT / "apps/frontend/public/assets/group3"
TMP = Path("/tmp/opencode/group3-hsk2-scenes")

# (pdf_page, lesson_label, scene_key, crop_y) — PDF page = printed page + 14.
# Explicit crop positions are intentional: the orange lesson headers can be
# more saturated than the photographs and are therefore unreliable as the
# only automatic crop signal on this scan.
SCENES = [
    (25, "hsk2-l2", "hotel", 720),
    (27, "hsk2-l2", "campus", 80),
    (29, "hsk2-l2", "cinema", 80),
    (34, "hsk2-l3", "homecoming", 650),
    (36, "hsk2-l3", "travel-plan", 80),
    (37, "hsk2-l3", "xian-plan", 1300),
    (52, "hsk2-l5", "hotel-call", 620),
    (54, "hsk2-l5", "family-greeting", 600),
    (56, "hsk2-l5", "family-meal", 590),
    (61, "hsk2-l6", "gift-plan", 600),
    (63, "hsk2-l6", "birthday-gift", 80),
    (64, "hsk2-l6", "birthday-meal", 1300),
    (71, "hsk2-l7", "basketball", 600),
    (73, "hsk2-l7", "football", 80),
    (75, "hsk2-l7", "swimming", 80),
    (79, "hsk2-l8", "watches", 600),
    (81, "hsk2-l8", "cinema", 80),
    (83, "hsk2-l8", "birthday", 80),
    (99, "hsk2-l10", "school-prep", 600),
    (101, "hsk2-l10", "exam-review", 600),
    (103, "hsk2-l10", "homecoming", 80),
    (117, "hsk2-l12", "weather-call", 600),
    (119, "hsk2-l12", "snow-call", 600),
    (121, "hsk2-l12", "running", 80),
    (127, "hsk2-l13", "new-year-flowers", 600),
    (129, "hsk2-l13", "classroom-characters", 600),
    (131, "hsk2-l13", "notebook-gift", 180),
    (136, "hsk2-l14", "downstairs-visitor", 600),
    (138, "hsk2-l14", "friends-reunion", 80),
    (140, "hsk2-l14", "apartment-neighbors", 80),
    (145, "hsk2-l15", "exam-plans", 600),
    (147, "hsk2-l15", "beijing-trip", 600),
    (149, "hsk2-l15", "airport-memory", 80),
]

BAND_W = 1636
BAND_H = 920
TARGET = (1400, 788)
TARGET_SMALL = (720, 405)


def render_page(pdf_page: int) -> Image.Image:
    TMP.mkdir(parents=True, exist_ok=True)
    target = TMP / f"h2-{pdf_page:03d}"
    subprocess.run(
        [
            "pdftoppm",
            "-png",
            "-r",
            "200",
            "-f",
            str(pdf_page),
            "-l",
            str(pdf_page),
            "-singlefile",
            str(PDF),
            str(target),
        ],
        check=True,
    )
    return Image.open(target.with_suffix(".png")).convert("RGB")


def save_webp(image: Image.Image, path: Path) -> None:
    image.save(path, "WEBP", quality=82, method=6)


def canonical_scene_paths(lesson_label: str, scene_index: int) -> tuple[Path, Path]:
    lesson_number = int(lesson_label.rsplit("l", 1)[1])
    scene_root = OUT / "lessons" / "hsk2" / f"lesson-{lesson_number:02d}" / "scenes"
    return (
        scene_root / f"scene-{scene_index:02d}-1400w.webp",
        scene_root / f"scene-{scene_index:02d}-720w.webp",
    )


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    rendered: dict[int, Image.Image] = {}
    scene_counts: dict[str, int] = {}
    for pdf_page, lesson_label, scene_key, crop_y in SCENES:
        scene_counts[lesson_label] = scene_counts.get(lesson_label, 0) + 1
        scene_index = scene_counts[lesson_label]
        if pdf_page not in rendered:
            rendered[pdf_page] = render_page(pdf_page)
        page = rendered[pdf_page]
        width, height = page.size
        y0 = min(max(0, crop_y), height - BAND_H)
        band = page.crop((0, y0, min(width, BAND_W), y0 + BAND_H))
        full_path, small_path = canonical_scene_paths(lesson_label, scene_index)
        full_path.parent.mkdir(parents=True, exist_ok=True)
        save_webp(band.resize(TARGET, Image.Resampling.LANCZOS), full_path)
        save_webp(band.resize(TARGET_SMALL, Image.Resampling.LANCZOS), small_path)
        print(f"{lesson_label}/{scene_key}: {full_path.relative_to(OUT)}, PDF {pdf_page}, crop y={y0}:{y0 + BAND_H}")


if __name__ == "__main__":
    main()
