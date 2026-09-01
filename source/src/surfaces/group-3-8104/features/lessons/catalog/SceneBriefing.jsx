import { useEffect, useRef, useState } from "react";
import Icon from "../../../../../shared/components/ui/Icon.jsx";
import {
  expandIcon,
  fileImageIcon,
  waveSquareIcon,
  xmarkIcon
} from "../../../../../shared/components/ui/iconPaths.js";
import { GROUP3_VOICE_PROFILES } from "../../../services/audio/index.js";


function sceneTitle(scene, language) {
  return language === "th" ? scene.titleTh : language === "zh" ? scene.title : scene.titleEn || scene.title;
}

function sceneContext(scene, language) {
  return language === "th" ? scene.contextTh : language === "zh" ? scene.context : scene.contextEn || scene.context;
}

function sceneSupportingContext(scene, language, text) {
  if (language === "th") return scene.context;
  if (language === "zh") return scene.contextTh || text.educationalUnavailable;
  return scene.context;
}

function profileName(profile, language) {
  if (!profile) return "Unknown";
  return language === "th" ? profile.th : language === "zh" ? profile.hanzi : profile.pinyin || profile.hanzi;
}

function profileWithSceneMedia(profile, characterData) {
  if (!profile) return { image: "", imageFocus: "center" };
  return {
    ...profile,
    image: characterData?.image || profile.image,
    imageSrcSet: characterData?.imageSrcSet || profile.imageSrcSet,
    imageFocus: characterData?.imageFocus || profile.imageFocus || "center",
  };
}

export function SceneBriefing({ characters, scene, language, text, onBegin, lowData = false }) {
  const [imageOpen, setImageOpen] = useState(false);
  const imageTriggerRef = useRef(null);
  const closeImage = () => {
    setImageOpen(false);
    window.requestAnimationFrame(() => imageTriggerRef.current?.focus());
  };

  useEffect(() => {
    if (!imageOpen) return undefined;
    const closeOnEscape = (event) => { if (event.key === "Escape") closeImage(); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [imageOpen]);

  return (
    <section className="g3-scene-briefing" aria-labelledby="g3-briefing-title">
      <figure className="g3-briefing-image">
        {!lowData && <img src={scene.image} srcSet={scene.imageSrcSet} sizes="(max-width: 760px) 100vw, 55vw" alt={scene.imageAlt[language]} width="1400" height={scene.imageSrcSet ? "788" : "900"} decoding="async" />}
        <figcaption><Icon paths={fileImageIcon} />{text.sceneImage} · {scene.source}</figcaption>
        {!lowData && <button ref={imageTriggerRef} type="button" onClick={() => setImageOpen(true)} aria-label={text.enlargeImage}><Icon paths={expandIcon} />{text.enlargeImage}</button>}
      </figure>
      <div className="g3-briefing-copy">
        <p className="g3-kicker">BEFORE THE DIALOGUE · {scene.number}</p>
        <h2 id="g3-briefing-title" tabIndex="-1">{text.beforeReading}</h2>
        <p className="g3-briefing-guide">{text.beforeReadingBody}</p>
        <div className="g3-briefing-context">
          <strong>{sceneContext(scene, language)}</strong>
          <span>{sceneSupportingContext(scene, language, text)}</span>
        </div>
        <div className="g3-character-intros">
          {scene.characters.map((character) => {
            const profile = profileWithSceneMedia(characters[character.profile], character);
            const voice = GROUP3_VOICE_PROFILES[character.profile];
            return (
              <article key={`${scene.id}-${character.role}`}>
                {!lowData && <img src={profile.image} srcSet={profile.imageSrcSet} alt={profileName(profile, language)} width="640" height="640" loading="lazy" decoding="async" style={{ objectPosition: profile.imageFocus }} />}
                <div>
                  <span>{text.role} {character.role}</span>
                  <h3>{profileName(profile, language)}</h3>
                  <small>{{ th: `${profile.hanzi} · ${profile.pinyin}`, zh: profile.pinyin, en: profile.hanzi }[language]}</small>
                  <em className="g3-character-voice"><Icon paths={waveSquareIcon} />{text.voiceCast} · {voice?.label || "TTS"}</em>
                  <p>{{ th: character.noteTh, zh: character.noteZh, en: character.noteEn || text.educationalUnavailable }[language]}</p>
                </div>
              </article>
            );
          })}
        </div>
        <div className="g3-briefing-actions">
          <button className="g3-primary-action" type="button" onClick={() => onBegin("autoplay")}>{text.autoplayBegin}<span aria-hidden="true">→</span></button>
          <button className="g3-briefing-manual" type="button" onClick={() => onBegin("manual")}>{text.manualBegin}</button>
          <small>{text.autoplayHint}</small>
        </div>
      </div>
      {imageOpen && !lowData && (
        <div className="g3-image-lightbox" role="dialog" aria-modal="true" aria-label={text.enlargeImage} onClick={(event) => { if (event.target === event.currentTarget) closeImage(); }}>
          <button type="button" onClick={closeImage} aria-label={text.closeImage}><Icon paths={xmarkIcon} /><span>{text.closeImage}</span></button>
          <img src={scene.image} srcSet={scene.imageSrcSet} alt={scene.imageAlt[language]} width="1400" height={scene.imageSrcSet ? "788" : "900"} decoding="async" />
          <p>{text.sceneImage} · {scene.source}</p>
        </div>
      )}
    </section>
  );
}
