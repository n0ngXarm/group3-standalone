import re

with open('/home/pisitpong/group3-standalone/source/src/surfaces/group-3-8104/styles/home-enhancements.css', 'r') as f:
    css = f.read()

# Replace everything from /* 2D Manga Stage Component */ up to /* ===== WOW FONT EFFECTS ===== */
start_marker = "/* 2D Manga Stage Component */"
end_marker = "/* ===== WOW FONT EFFECTS ===== */"
start_idx = css.find(start_marker)
end_idx = css.find(end_marker)

new_manga_css = """/* ===== 2D MANGA STAGE COMPONENT & LAYER CONTRACT ===== */

/* THEME TOKENS */
:root {
  --g3-stage-dialogue-primary: #ffffff;
  --g3-stage-dialogue-secondary: rgba(255, 255, 255, 0.95);
  --g3-stage-dialogue-muted: rgba(255, 255, 255, 0.9);
  --g3-stage-control-bg: rgba(0, 0, 0, 0.4);
  --g3-stage-control-fg: #ffffff;
  --g3-stage-label-bg: rgba(0, 0, 0, 0.6);
  --g3-stage-label-fg: #ffffff;
  --g3-stage-label-border: rgba(255, 255, 255, 0.2);
  --g3-stage-bottom-overlay: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 55%, transparent 100%);
  --g3-stage-pagination-inactive: rgba(255, 255, 255, 0.6);
  --g3-stage-pagination-active: var(--g3-red);
}

:root[data-theme="light"] {
  --g3-stage-dialogue-primary: var(--g3-ink);
  --g3-stage-dialogue-secondary: var(--g3-jade);
  --g3-stage-dialogue-muted: var(--g3-muted);
  --g3-stage-control-bg: rgba(255, 255, 255, 0.7);
  --g3-stage-control-fg: var(--g3-ink);
  --g3-stage-label-bg: rgba(255, 255, 255, 0.9);
  --g3-stage-label-fg: var(--g3-ink);
  --g3-stage-label-border: rgba(0, 0, 0, 0.1);
  --g3-stage-bottom-overlay: linear-gradient(to top, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.6) 55%, transparent 100%);
  --g3-stage-pagination-inactive: rgba(0, 0, 0, 0.25);
  --g3-stage-pagination-active: var(--g3-red);
}

.g3-manga-stage-card {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 5;
}

.g3-manga-viewport {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: transparent;
}

/* z0 Scene Background */
.g3-manga-backdrop {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.g3-manga-bg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  filter: brightness(0.92) contrast(1.05);
  display: block;
}

/* z1 Scene Atmosphere */
.g3-manga-atmosphere {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.g3-manga-bg-vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, transparent 40%, rgba(0, 0, 0, 0.45) 100%),
              linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.6) 100%);
}

.g3-manga-dust {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.g3-manga-dust i {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(255, 244, 214, 0.55);
  filter: blur(1px);
  top: calc(18% + (var(--g3-dust-index) * 13%));
  left: calc(12% + (var(--g3-dust-index) * 15%));
  opacity: 0;
  animation: g3-dust-drift 9s linear infinite;
  animation-delay: calc(var(--g3-dust-index) * -1.4s);
}

@keyframes g3-dust-drift {
  0% { opacity: 0; transform: translate3d(0, 12px, 0); }
  18% { opacity: 0.85; }
  72% { opacity: 0.5; }
  100% { opacity: 0; transform: translate3d(26px, -46px, 0); }
}

/* z2 Left Blend */
.g3-manga-left-blend {
  position: absolute;
  inset: 0 auto 0 0;
  width: clamp(70px, 8vw, 150px);
  z-index: 2;
  background: linear-gradient(to right, var(--g3-bg) 0%, transparent 100%);
  pointer-events: none;
}

/* z3 Actors Layer */
.g3-manga-actors-layer {
  position: absolute;
  inset: 0;
  z-index: 3;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 0 2rem 140px;
  pointer-events: none;
}

.g3-manga-actor {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: clamp(140px, 20vw, 220px);
  transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1), filter 300ms ease;
  transform: scale(1);
}

.g3-manga-actor.is-talking {
  transform: scale(1.05);
  z-index: 2;
}

.g3-manga-actor.is-idle {
  opacity: 0.82;
  filter: brightness(0.88);
}

.g3-manga-actor-label {
  position: absolute;
  top: -1.5rem;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  padding: 0.15rem 0.6rem;
  background: var(--g3-stage-label-bg);
  color: var(--g3-stage-label-fg);
  border: 1px solid var(--g3-stage-label-border);
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  backdrop-filter: blur(2px);
  transition: all 0.3s;
  z-index: 2;
  pointer-events: none;
}

.g3-manga-actor.is-talking .g3-manga-actor-label {
  font-weight: 800;
  box-shadow: 0 2px 8px rgba(0,0,0,0.25);
}

.g3-manga-actor-frames {
  position: relative;
  width: 100%;
  height: clamp(240px, 32vh, 480px);
}

.g3-manga-actor-frame {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: bottom;
  filter: drop-shadow(0 0.5rem 1rem rgba(0, 0, 0, 0.45));
  transition: opacity 420ms ease;
}

.g3-manga-actor-frame.is-active { opacity: 1; }
.g3-manga-actor-frame.is-fade { opacity: 0; }

.g3-manga-actor-sprite {
  width: 100%;
  height: auto;
  max-height: clamp(340px, 45vh, 540px);
  object-fit: contain;
  object-position: bottom;
  filter: drop-shadow(0 0.5rem 1rem rgba(0, 0, 0, 0.45));
  display: block;
}

/* z4 Navigation Layer */
.g3-manga-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 4;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid var(--g3-stage-label-border);
  background: var(--g3-stage-control-bg);
  color: var(--g3-stage-control-fg);
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  transition: background 0.2s, transform 0.2s, color 0.2s;
  padding: 0;
  margin: 0;
}

.g3-manga-arrow:hover {
  background: var(--g3-red);
  transform: translateY(-50%) scale(1.1);
  color: #fff;
  border-color: transparent;
}

.g3-manga-arrow.is-prev { left: 1rem; }
.g3-manga-arrow.is-next { right: 1rem; }

/* z5 Dialogue + Audio Layer */
.g3-manga-dialogue-layer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 5;
  background: var(--g3-stage-bottom-overlay);
  padding: 4rem 1rem 3.5rem;
  pointer-events: none;
}

.g3-manga-subtitle-box {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: transparent;
  border: 0;
  box-shadow: none;
  backdrop-filter: none;
}

.g3-manga-subtitle-content {
  width: 90%;
  max-width: clamp(300px, 65%, 600px);
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: auto;
}

.g3-manga-subtitle-header {
  display: flex;
  justify-content: center;
  width: 100%;
  position: relative;
  margin-bottom: 8px;
}

.g3-manga-speaker-tag {
  font-size: clamp(12px, 0.9vw, 15px);
  font-weight: 600;
  background: var(--g3-stage-label-bg);
  color: var(--g3-stage-label-fg);
  padding: 0.25rem 0.8rem;
  border-radius: 999px;
  border: 1px solid var(--g3-stage-label-border);
  letter-spacing: 0.03em;
  box-shadow: 0 2px 4px rgba(0,0,0,0.15);
}

.g3-manga-subtitle-actions {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

.g3-manga-audio-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid var(--g3-stage-label-border);
  background: var(--g3-stage-control-bg);
  color: var(--g3-stage-control-fg);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 150ms ease, background 150ms ease;
}

.g3-manga-audio-btn:hover {
  transform: scale(1.1);
  background: var(--g3-red);
  color: #fff;
  border-color: transparent;
}

.g3-manga-audio-btn .ui-icon {
  width: 1.2rem;
  height: 1.2rem;
}

.g3-manga-hanzi {
  font-family: var(--font-display);
  font-size: clamp(26px, 2vw, 38px);
  font-weight: 800;
  color: var(--g3-stage-dialogue-primary);
  margin: 0;
  line-height: 1.35;
  letter-spacing: 0.02em;
  text-align: center;
  width: 100%;
}

.g3-manga-pinyin {
  font-size: clamp(16px, 1.15vw, 21px);
  font-weight: 500;
  color: var(--g3-stage-dialogue-secondary);
  margin: 0.3rem 0 0;
  line-height: 1.4;
  text-align: center;
  width: 100%;
}

.g3-manga-thai {
  font-size: clamp(15px, 1vw, 18px);
  font-weight: 400;
  color: var(--g3-stage-dialogue-muted);
  margin: 0.4rem 0 0;
  line-height: 1.45;
  text-align: center;
  width: 100%;
}

/* z6 Pagination Layer */
.g3-home-carousel-dots {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 6;
  display: flex;
  gap: 0.5rem;
  padding: 0;
}

.g3-home-carousel-dot {
  width: 0.6rem;
  height: 0.6rem;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: var(--g3-stage-pagination-inactive);
  cursor: pointer;
  transition: all 180ms ease;
}

.g3-home-carousel-dot.is-active {
  width: 1.5rem;
  background: var(--g3-stage-pagination-active);
}

"""

css = css[:start_idx] + new_manga_css + css[end_idx:]

# Also remove the specific PREMIUM CASCADE FIXES for g3-manga-viewport and g3-home-carousel-dot
# which start around line 1086 (now shifted)
import re
# Regex to remove the .g3-manga-viewport block in PREMIUM CASCADE FIXES
css = re.sub(r'/\* Manga stage: premium mat \+ gold hairline frame.*?\}', '', css, flags=re.DOTALL)
# Regex to remove Carousel dots hacks
css = re.sub(r'/\* Carousel dots:.*?\n\}', '', css, flags=re.DOTALL)


with open('/home/pisitpong/group3-standalone/source/src/surfaces/group-3-8104/styles/home-enhancements.css', 'w') as f:
    f.write(css)

print("CSS updated successfully!")
