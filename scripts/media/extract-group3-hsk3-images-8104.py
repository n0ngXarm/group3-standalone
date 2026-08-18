#!/usr/bin/env python3
"""Extract responsive Group 3 scene bands from the scanned HSK3 textbook.

The source of truth is ``hsk3.pdf`` and PDF page = printed page + 12. Each
scene emits the 1400px and 720px 16:9 WebP variants inside that lesson's
canonical media directory.
"""

from __future__ import annotations

from pathlib import Path
import subprocess

from PIL import Image


ROOT = Path(__file__).resolve().parents[2]
PDF = ROOT / "docs/references/hsk/sources/hsk3.pdf"
OUT = ROOT / "apps/frontend/public/assets/group3"
TMP = Path("/tmp/opencode/group3-hsk3-scenes")

# (pdf_page, lesson_label, scene_key, crop_y); PDF page = printed page + 12.
# Crop positions are fixed after visual inspection of the scanned dialogue
# pages so repeated runs are deterministic and do not follow orange headers.
SCENES = [
    (14, "hsk3-l1", "home", 600),
    (15, "hsk3-l1", "baggage", 1300),
    (17, "hsk3-l1", "arrival", 1300),
    (32, "hsk3-l3", "neighborhood", 600),
    (33, "hsk3-l3", "new-home", 1300),
    (35, "hsk3-l3", "bank", 600),
    (42, "hsk3-l4", "grassland", 600),
    (43, "hsk3-l4", "hotel-plan", 1300),
    (45, "hsk3-l4", "airport-driver", 700),
    (51, "hsk3-l5", "walk", 600),
    (52, "hsk3-l5", "photos", 1300),
    (54, "hsk3-l5", "mountain", 600),
    (60, "hsk3-l6", "tickets", 600),
    (61, "hsk3-l6", "drive", 1300),
    (63, "hsk3-l6", "station", 700),
    (80, "hsk3-l8", "gym", 600),
    (82, "hsk3-l8", "classroom", 600),
    (83, "hsk3-l8", "ward", 700),
    (89, "hsk3-l9", "card", 600),
    (91, "hsk3-l9", "badminton", 600),
    (92, "hsk3-l9", "football", 700),
    (99, "hsk3-l10", "notes", 600),
    (101, "hsk3-l10", "exam", 600),
    (103, "hsk3-l10", "office", 600),
    (108, "hsk3-l11", "meeting", 600),
    (110, "hsk3-l11", "computer", 600),
    (111, "hsk3-l11", "workload", 600),
    (117, "hsk3-l12", "park", 600),
    (119, "hsk3-l12", "rain", 600),
    (120, "hsk3-l12", "winter", 600),
    (128, "hsk3-l13", "restaurant", 600),
    (130, "hsk3-l13", "party-prep", 600),
    (131, "hsk3-l13", "birthday", 600),
    (137, "hsk3-l14", "library", 600),
    (139, "hsk3-l14", "campus", 600),
    (140, "hsk3-l14", "performance", 600),
    (146, "hsk3-l15", "neighborhood", 600),
    (148, "hsk3-l15", "nanjing", 600),
    (149, "hsk3-l15", "yellow-river", 900),
    (157, "hsk3-l16", "pet-center", 650),
    (159, "hsk3-l16", "zoo", 500),
    (161, "hsk3-l16", "panda-house", 450),
    (167, "hsk3-l17", "teaching-building", 600),
    (168, "hsk3-l17", "reading-room", 1000),
    (170, "hsk3-l17", "campus", 700),
    (176, "hsk3-l18", "spring-festival-flight", 600),
    (178, "hsk3-l18", "new-year-visit", 250),
    (179, "hsk3-l18", "family-photos", 900),
]

BAND_W = 1636
BAND_H = 920
TARGET = (1400, 788)
TARGET_SMALL = (720, 405)


def render_page(pdf_page: int) -> Image.Image:
    TMP.mkdir(parents=True, exist_ok=True)
    target = TMP / f"h3-{pdf_page:03d}"
    subprocess.run(
        [
            "pdftoppm", "-png", "-r", "200", "-f", str(pdf_page),
            "-l", str(pdf_page), "-singlefile", str(PDF), str(target),
        ],
        check=True,
    )
    return Image.open(target.with_suffix(".png")).convert("RGB")


def save_webp(image: Image.Image, path: Path) -> None:
    image.save(path, "WEBP", quality=82, method=6)


def canonical_scene_paths(lesson_label: str, scene_index: int) -> tuple[Path, Path]:
    lesson_number = int(lesson_label.rsplit("l", 1)[1])
    scene_root = OUT / "lessons" / "hsk3" / f"lesson-{lesson_number:02d}" / "scenes"
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
