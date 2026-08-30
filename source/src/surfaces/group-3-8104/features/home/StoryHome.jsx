import { useEffect, useRef, useState } from "react";

import Icon from "../../../../shared/components/ui/Icon.jsx";
import {
  expandIcon,
  fileImageIcon,
  waveSquareIcon,
  xmarkIcon,
} from "../../../../shared/components/ui/iconPaths.js";
import { group3AssetPath } from "../../config.js";
import { COPY } from "../../content/copy.js";
import { FEATURED_LESSON, GROUP3_LESSONS } from "../../content/registry.js";
import { GROUP3_VOICE_PROFILES } from "../../services/audio/index.js";
import { levelPath, levelsPath, lessonVocabularyPath, lessonScenePath, practicePath, scenePath } from "../../routing/routes.js";
import { startLearnerSession } from "../../shared/session.js";

function sceneTitle(scene, language) {
  return { th: scene.titleTh, zh: scene.title, en: scene.titleEn || scene.title }[language];
}

function sceneSupportingTitle(scene, language, text) {
  return { th: scene.title, zh: scene.titleTh, en: scene.title }[language];
}

function sceneContext(scene, language) {
  return { th: scene.contextTh, zh: scene.context, en: scene.contextEn || scene.context }[language];
}

function sceneSupportingContext(scene, language, text) {
  return { th: scene.context, zh: scene.contextTh, en: scene.context }[language];
}

function profileName(profile, language) {
  return { th: profile.nameTh, zh: profile.hanzi, en: profile.nameEn || profile.pinyin }[language];
}

function profileWithSceneMedia(profile, character) {
  return character?.image ? { ...profile, image: character.image, imageSrcSet: character.imageSrcSet } : profile;
}

import { HomeCarousel } from "../home/HomeCarousel.jsx";


export function StoryHome({ language, navigate, lowData = false }) {
  const [activeScenario, setActiveScenario] = useState(0);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [learnerName, setLearnerName] = useState("");
  const [registerError, setRegisterError] = useState(false);
  const nameInputRef = useRef(null);
  const text = COPY[language];
  const featured = FEATURED_LESSON;
  const featuredPath = scenePath(featured, 1);
  const navigateWithCue = (path) => {
    navigate(path || featuredPath);
  };

  useEffect(() => {
    if (!registerOpen) return undefined;
    nameInputRef.current?.focus();
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setRegisterOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [registerOpen]);

  const startPractice = (event) => {
    event.preventDefault();
    const name = learnerName.trim();
    if (!name) {
      setRegisterError(true);
      nameInputRef.current?.focus();
      return;
    }
    startLearnerSession(name);
    setRegisterOpen(false);
    navigate(levelsPath(), { replace: true });
  };

  return (
    <main className="g3-home is-single-screen">
      <section className="g3-home-hero" aria-labelledby="g3-home-title">
        <div className="g3-hero-copy">
          <div className="sign-wrap g3-premium-entrance">
            <div className="sign-anchor"></div>
            <svg className="sign-triangle-ropes" preserveAspectRatio="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <line x1="50" y1="0" x2="5" y2="100" stroke="url(#ropeGrad)" strokeWidth="1.5" />
              <line x1="50" y1="0" x2="95" y2="100" stroke="url(#ropeGrad)" strokeWidth="1.5" />
              <defs>
                <linearGradient id="ropeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#cfa05d" />
                  <stop offset="100%" stopColor="#7a5426" />
                </linearGradient>
              </defs>
            </svg>
            <div className="sign-bar"></div>
            <div className="sign-ropes">
              <span></span>
              <span></span>
            </div>
            <div className="sign">
              <h1 id="g3-home-title" className="title" tabIndex="-1" dangerouslySetInnerHTML={{ __html: text.heroTitleLine.replace(/\n/g, "<br/>") }} />
            </div>
            <div className="sign-tassel left"></div>
            <div className="sign-tassel right"></div>
          </div>
          <div className="g3-home-copy-zone">
            <p className="g3-home-lead">{text.heroSubLead}</p>
            <p className="g3-home-expl">{text.heroSubExpl}</p>
            <p className="g3-home-meta">{text.benefitOne}</p>
          </div>

          <div className="g3-home-cta-row is-centered">
            <button
              className="g3-home-cta-primary g3-wow-button-primary"
              type="button"
              onClick={() => {
                setRegisterError(false);
                setRegisterOpen(true);
              }}
            >
              {text.ctaStart}<i aria-hidden="true">→</i>
            </button>
          </div>
          
        </div>

        {/* 5-Slide Manga Carousel — animated 2D frame-by-frame scenes */}
        <HomeCarousel
          language={language}
          navigate={navigate}
          activeScenario={activeScenario}
          onSelectScenario={setActiveScenario}
          lowData={lowData}
        />
      </section>
      {registerOpen && (
        <div
          className="g3-register-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setRegisterOpen(false);
          }}
        >
          <form className="g3-register-modal" role="dialog" aria-modal="true" aria-labelledby="g3-register-title" onSubmit={startPractice}>
            <button className="g3-register-close" type="button" aria-label={text.registerClose} onClick={() => setRegisterOpen(false)}>×</button>
            <p className="g3-home-section-label">{text.registerKicker}</p>
            <h2 id="g3-register-title">{text.registerTitle}</h2>
            <p>{text.registerPrompt}</p>
            <label htmlFor="g3-learner-name">{text.registerNameLabel}</label>
            <input
              ref={nameInputRef}
              id="g3-learner-name"
              type="text"
              value={learnerName}
              onChange={(event) => {
                setLearnerName(event.target.value);
                setRegisterError(false);
              }}
              placeholder={text.registerNamePlaceholder}
              autoComplete="name"
              aria-invalid={registerError}
            />
            {registerError && <small className="g3-register-error">{text.registerNameRequired}</small>}
            <button className="g3-register-submit" type="submit">{text.registerContinue}<i aria-hidden="true">→</i></button>
          </form>
        </div>
      )}
    </main>
  );
}
