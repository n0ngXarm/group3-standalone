#!/usr/bin/env python3
"""
clean-character-cutouts.py
Advanced character sprite cutout cleaner, defringer, and alpha refiner.
Removes white halos, trapped background patches, and jagged edges.
"""

import os
import glob
import numpy as np
from PIL import Image
from scipy.ndimage import distance_transform_edt, label, binary_erosion, gaussian_filter

def refine_character_cutout(img_path):
    im = Image.open(img_path)
    if im.mode != 'RGBA':
        im = im.convert('RGBA')
    arr = np.array(im)
    h, w = arr.shape[:2]
    
    rgb = arr[:, :, :3].astype(np.float32)
    alpha = arr[:, :, 3].astype(np.float32) / 255.0
    
    # 1. Connected components to remove detached floating noise/specks
    solid = alpha > 0.3
    labeled, num_features = label(solid)
    if num_features > 1:
        sizes = [(labeled == i).sum() for i in range(1, num_features + 1)]
        max_size = max(sizes)
        for i, sz in enumerate(sizes, 1):
            if sz < 200:  # small noise speck
                alpha[labeled == i] = 0.0
                
    # 2. Identify white/light background fringe
    is_white_fringe = (rgb[:, :, 0] > 210) & (rgb[:, :, 1] > 210) & (rgb[:, :, 2] > 210)
    
    # Core solid foreground: high alpha and not white fringe
    core_fg = (alpha > 0.75) & (~is_white_fringe | (alpha > 0.98))
    
    # If core_fg is empty or too small, fallback
    if core_fg.sum() < 500:
        core_fg = alpha > 0.5
        
    # Distance transform to find nearest true core color
    _, indices = distance_transform_edt(~core_fg, return_indices=True)
    decontam_rgb = rgb[indices[0], indices[1]]
    
    # 3. Clean and antialias the alpha channel
    # Erode fringe where light background clung to edge
    fringe_zone = (alpha > 0.05) & (alpha < 0.92)
    clean_alpha = alpha.copy()
    clean_alpha[fringe_zone & is_white_fringe] *= 0.4
    
    # Smooth edge using morphological antialiasing
    eroded = binary_erosion(clean_alpha > 0.35, iterations=1).astype(np.float32)
    blurred = gaussian_filter(eroded, sigma=0.6)
    
    final_alpha = np.where(clean_alpha > 0.92, clean_alpha, np.minimum(clean_alpha, blurred * 1.15))
    final_alpha = np.clip(final_alpha, 0.0, 1.0)
    final_alpha[final_alpha < 0.02] = 0.0
    
    # 4. Color assignment: use decontam_rgb everywhere alpha is semi-transparent
    # This guarantees 0 white halo!
    final_rgb = rgb.copy()
    edge_blend = (final_alpha < 0.95) & (final_alpha > 0.0)
    final_rgb[edge_blend] = decontam_rgb[edge_blend]
    
    out_arr = np.zeros_like(arr)
    out_arr[:, :, :3] = np.clip(final_rgb, 0, 255).astype(np.uint8)
    out_arr[:, :, 3] = (final_alpha * 255.0).astype(np.uint8)
    
    out_im = Image.fromarray(out_arr)
    return out_im

def main():
    char_dir = os.path.join(os.path.dirname(__file__), '../../source/public/assets/group3/shared/characters')
    char_dir = os.path.abspath(char_dir)
    files = sorted(glob.glob(os.path.join(char_dir, 'hero-*.webp')))
    
    print(f"Processing {len(files)} character images in {char_dir}...")
    for f in files:
        base = os.path.basename(f)
        cleaned_im = refine_character_cutout(f)
        cleaned_im.save(f, format='WEBP', lossless=True, quality=100, method=6)
        print(f"  ✓ Refined & Saved: {base}")
    print("All character cutouts cleaned successfully!")

if __name__ == '__main__':
    main()
