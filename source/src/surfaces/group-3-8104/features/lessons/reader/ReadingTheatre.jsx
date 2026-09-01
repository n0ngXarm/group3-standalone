import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import Icon from "../../../../../shared/components/ui/Icon.jsx";
import {
  volumeHighIcon,
} from "../../../../../shared/components/ui/iconPaths.js";
import { QteChallenge, SentenceChallenge } from "../challenges/index.js";
import "./ReaderLayout.css";
import { GROUP3_PLAYBACK_CONFIG } from "../../../config.js";
import { COPY } from "../../../content/copy.js";
import {
  dialogueVoicePath,
  GROUP3_VOICE_PROFILES,
  speakChinese,
  stopChineseVoice,
  unlockChineseAudio,
} from "../../../services/audio/index.js";
import { levelPath, lessonScenePath } from "../../../routing/routes.js";

const SOUND_FAILURE_STATES = new Set(["blocked", "timeout", "unavailable"]);
const RoleplayView = lazy(() => import("../challenges/Roleplay.jsx").then((module) => ({
  default: module.RoleplayView,
})));

function sceneTitle(scene, language) {
  return { th: scene.titleTh, zh: scene.title, en: scene.titleEn || scene.title }[language] || scene.titleTh || scene.title;
}

function sceneContext(scene, language) {
  return { th: scene.contextTh, zh: scene.context, en: scene.contextEn || scene.context }[language] || scene.contextTh || scene.context;
}

function profileName(profile, language) {
  return { th: profile.nameTh, zh: profile.hanzi, en: profile.nameEn || profile.pinyin }[language] || profile.nameTh || profile.hanzi;
}

export function ReadingTheatre({ initialScene, language, lesson, navigate, lowData = false }) {
  const text = COPY[language] || COPY.th;
  const scenes = lesson.scenes || [];
  const lessonCharacterProfiles = lesson.characters || {};

  const [sceneIndex, setSceneIndex] = useState(initialScene);
  const [lineIndex, setLineIndex] = useState(0);
  const [resolved, setResolved] = useState([]);
  const [challenge, setChallenge] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [timed, setTimed] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);
  const [playbackMode, setPlaybackMode] = useState("manual");
  const [playbackStatus, setPlaybackStatus] = useState("paused");
  const [playbackRevision, setPlaybackRevision] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(GROUP3_PLAYBACK_CONFIG.defaultSpeed);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [soundBlocked, setSoundBlocked] = useState(false);
  const [replayRevision, setReplayRevision] = useState(0);
  const [roleplayRole, setRoleplayRole] = useState(null);

  const scene = scenes[sceneIndex] || scenes[0];
  const characterProfiles = useMemo(() => {
    const profiles = { ...lessonCharacterProfiles };
    if (scene?.characters) {
      scene.characters.forEach((character) => {
        const profile = profiles[character.profile];
        if (profile && character.image) {
          profiles[character.profile] = {
            ...profile,
            image: character.image,
            imageSrcSet: character.imageSrcSet,
          };
        }
      });
    }
    return profiles;
  }, [lessonCharacterProfiles, scene]);

  const currentLine = (scene?.lines && lineIndex >= 0 && lineIndex < scene.lines.length)
    ? scene.lines[lineIndex]
    : scene?.lines?.[0] || null;

  const currentCharacter = currentLine
    ? scene.characters?.find((item) => item.role === currentLine.role)
    : null;
  const currentVoiceProfile = currentCharacter?.profile || "wang";
  const currentProfile = currentCharacter ? characterProfiles[currentCharacter.profile] : null;

  const pendingChallengeType = useCallback((index) => {
    if (!scene || index < 0) return null;
    if (scene.qte && index === scene.qte.after && !resolved.includes("qte")) return "qte";
    if (scene.builder && index === scene.lines.length - 1 && !resolved.includes("builder")) return "builder";
    return null;
  }, [resolved, scene]);

  const openChallenge = useCallback((type, resumeAutoplay) => {
    stopChineseVoice();
    setChallenge({
      data: type === "qte" ? scene.qte : scene.builder,
      resumeAutoplay,
      type,
    });
    setPlaybackStatus(type === "qte" ? "challenge" : "builder");
  }, [scene]);

  useEffect(() => {
    setSceneIndex(initialScene);
  }, [initialScene]);

  useEffect(() => {
    stopChineseVoice();
    setLineIndex(0);
    setResolved([]);
    setChallenge(null);
    setCompleted(false);
    setPlaybackMode("manual");
    setPlaybackStatus("paused");
    setSoundBlocked(false);
    setReplayRevision((v) => v + 1);
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [sceneIndex]);

  // Audio Playback & Sequential listening loop
  useEffect(() => {
    if (lineIndex < 0 || challenge || completed || !currentLine) {
      return undefined;
    }

    let cancelled = false;
    let cancelDelay = () => {};
    const wait = (duration) => new Promise((resolve) => {
      let settled = false;
      const finish = (result) => {
        if (settled) return;
        settled = true;
        resolve(result);
      };
      const timer = window.setTimeout(() => finish(true), duration);
      cancelDelay = () => {
        window.clearTimeout(timer);
        finish(false);
      };
    });

    const run = async () => {
      let audioResult = { status: "muted" };
      if (soundEnabled && !soundBlocked) {
        const playback = speakChinese(currentLine.hanzi, {
          audioSrc: dialogueVoicePath(lesson, sceneIndex, lineIndex),
          maxDurationMs: GROUP3_PLAYBACK_CONFIG.audioTimeoutMs,
          profileId: currentVoiceProfile,
          rate: playbackSpeed,
        });
        setPlaybackStatus("playing");
        audioResult = await playback.completion;
        if (cancelled || audioResult.status === "cancelled") return;
        if (SOUND_FAILURE_STATES.has(audioResult.status)) {
          if (audioResult.status === "blocked") {
            setSoundBlocked(true);
          }
          setPlaybackStatus("paused");
          return;
        }
      }

      if (playbackMode === "autoplay") {
        if (SOUND_FAILURE_STATES.has(audioResult.status) || audioResult.status === "muted") {
          const stayed = await wait(GROUP3_PLAYBACK_CONFIG.silentLineMs / playbackSpeed);
          if (!stayed || cancelled) return;
        }

        const stayed = await wait(GROUP3_PLAYBACK_CONFIG.lineGapMs);
        if (!stayed || cancelled) return;

        const nextChallenge = pendingChallengeType(lineIndex);
        if (nextChallenge) {
          const QTE_POST_SPEECH_DELAY_MS = 2000;
          const stayedQte = await wait(QTE_POST_SPEECH_DELAY_MS);
          if (!stayedQte || cancelled) return;
          openChallenge(nextChallenge, true);
        } else if (lineIndex < scene.lines.length - 1) {
          setLineIndex((value) => value + 1);
        } else {
          setCompleted(true);
          setPlaybackStatus("complete");
        }
      } else {
        setPlaybackStatus("paused");
      }
    };

    run();
    return () => {
      cancelled = true;
      cancelDelay();
      stopChineseVoice();
    };
  }, [
    challenge,
    completed,
    currentLine?.hanzi,
    currentVoiceProfile,
    lineIndex,
    lesson,
    openChallenge,
    pendingChallengeType,
    playbackMode,
    playbackRevision,
    playbackSpeed,
    replayRevision,
    scene?.id,
    scene?.lines?.length,
    sceneIndex,
    soundBlocked,
    soundEnabled,
  ]);

  useEffect(() => {
    const pauseWhenHidden = () => {
      if (!document.hidden) return;
      stopChineseVoice();
      setPlaybackStatus((status) => status === "playing" ? "paused" : status);
    };
    document.addEventListener("visibilitychange", pauseWhenHidden);
    return () => document.removeEventListener("visibilitychange", pauseWhenHidden);
  }, []);

  useEffect(() => () => {
    stopChineseVoice();
  }, []);

  const resolveChallenge = useCallback(() => {
    if (!challenge) return;
    const { resumeAutoplay, type } = challenge;
    setResolved((current) => current.includes(type) ? current : [...current, type]);
    if (type === "builder") {
      setChallenge(null);
      setCompleted(true);
      setPlaybackStatus("complete");
      return;
    }

    if (lineIndex < scene.lines.length - 1) {
      setChallenge(null);
      setPlaybackMode(resumeAutoplay ? "autoplay" : "manual");
      setPlaybackStatus(resumeAutoplay ? "playing" : "paused");
      setLineIndex((value) => value + 1);
      return;
    }

    setChallenge({ data: scene.builder, resumeAutoplay, type: "builder" });
    setPlaybackStatus("builder");
  }, [challenge, lineIndex, scene]);

  const previousLine = useCallback(() => {
    stopChineseVoice();
    setPlaybackMode("manual");
    setPlaybackStatus("paused");
    setLineIndex((value) => Math.max(0, value - 1));
  }, []);

  const nextLine = useCallback(() => {
    stopChineseVoice();
    const nextChallenge = pendingChallengeType(lineIndex);
    if (nextChallenge) {
      openChallenge(nextChallenge, false);
      return;
    }
    setPlaybackMode("manual");
    setPlaybackStatus("paused");
    if (lineIndex < scene.lines.length - 1) {
      setLineIndex((value) => value + 1);
    } else {
      setCompleted(true);
      setPlaybackStatus("complete");
    }
  }, [lineIndex, openChallenge, pendingChallengeType, scene.lines.length]);

  const replayCurrentLine = useCallback(() => {
    if (!currentLine) return;
    unlockChineseAudio();
    setSoundBlocked(false);
    setSoundEnabled(true);
    setReplayRevision((value) => value + 1);
  }, [currentLine]);

  const unblockAndPlayAudio = useCallback(() => {
    unlockChineseAudio();
    setSoundBlocked(false);
    setSoundEnabled(true);
    setReplayRevision((value) => value + 1);
  }, []);

  const toggleAutoplayListening = useCallback(() => {
    if (playbackStatus === "playing" && playbackMode === "autoplay") {
      stopChineseVoice();
      setPlaybackMode("manual");
      setPlaybackStatus("paused");
    } else {
      unlockChineseAudio();
      setPlaybackMode("autoplay");
      setPlaybackStatus("playing");
      setPlaybackRevision((value) => value + 1);
    }
  }, [playbackMode, playbackStatus]);

  const setManualReadingMode = useCallback(() => {
    if (playbackMode === "autoplay") {
      stopChineseVoice();
      setPlaybackMode("manual");
      setPlaybackStatus("paused");
    }
  }, [playbackMode]);

  const selectScene = useCallback((nextIndex) => {
    stopChineseVoice();
    setRoleplayRole(null);
    navigate(lessonScenePath(lesson, nextIndex + 1));
  }, [lesson, navigate]);

  const restartScene = useCallback(() => {
    stopChineseVoice();
    setRoleplayRole(null);
    setLineIndex(0);
    setResolved([]);
    setChallenge(null);
    setCompleted(false);
    setPlaybackMode("manual");
    setPlaybackStatus("paused");
    setSoundBlocked(false);
    setReplayRevision((value) => value + 1);
  }, []);

  const roleplayActive = Boolean(roleplayRole) && !challenge && !completed && lineIndex >= 0;
  const roleplayStatus = soundBlocked ? "blocked" : playbackStatus === "paused" ? "paused" : playbackStatus;

  return (
    <main className={`g3-reader-layout g3-reader--${lesson.level}${roleplayActive ? " is-roleplay" : ""}`} data-status={playbackStatus}>
      <div className="g3-reader-workspace">
        {/* LEFT PANEL — SCENE NAVIGATION */}
        <aside className="g3-reader-toc" aria-label="แถบนำทางบทเรียน">
          <button
            className="g3-reader-back-btn"
            type="button"
            onClick={() => navigate(levelPath(lesson.level))}
            aria-label="กลับหน้าเลือกบท"
          >
            <span aria-hidden="true">←</span> {language === "th" ? "กลับหน้าเลือกบท" : language === "zh" ? "返回选课" : "Back to lessons"}
          </button>

          <div className="g3-reader-toc-header">
            <h3>{language === "th" ? "ฉากในบทเรียน" : language === "zh" ? "本课场景" : "Scenes in lesson"}</h3>
          </div>

          <ul className="g3-reader-scene-list">
            {scenes.map((item, index) => {
              const isActive = sceneIndex === index;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`g3-reader-scene-item ${isActive ? "is-active" : ""}`}
                    onClick={() => selectScene(index)}
                    aria-current={isActive ? "step" : undefined}
                  >
                    <span className="g3-reader-scene-dot" aria-hidden="true">{isActive ? "●" : "○"}</span>
                    <div className="g3-reader-scene-meta">
                      <span className="g3-reader-scene-num">{String(item.number || index + 1).padStart(2, "0")}</span>
                      <strong className="g3-reader-scene-name">{sceneTitle(item, language)}</strong>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* CENTER — SCENE IMAGE */}
        <section className="g3-reader-visual" aria-label="ภาพประกอบฉาก">
          <div className="g3-reader-image-frame">
            {!lowData && scene?.image && (
              <img
                src={scene.image}
                srcSet={scene.imageSrcSet}
                alt={scene.imageAlt?.[language] || ""}
                className="g3-reader-hero-img"
                loading="eager"
                decoding="async"
              />
            )}
            <div className="g3-reader-image-overlay">
              <span className="g3-reader-image-badge">
                {language === "th" ? `ฉาก ${String(scene?.number || sceneIndex + 1).padStart(2, "0")}` : `Scene ${String(scene?.number || sceneIndex + 1).padStart(2, "0")}`}
              </span>
              {scene?.title && <span className="g3-reader-image-hanzi">{scene.title}</span>}
            </div>
          </div>
        </section>

        {/* RIGHT PANEL — ACTUAL LEARNING */}
        <section className="g3-reader-stage" aria-label="พื้นที่เรียนบทสนทนา">
          {/* Header */}
          <header className="g3-reader-stage-header">
            <div className="g3-reader-stage-badge">
              {language === "th" ? `ฉาก ${String(scene?.number || sceneIndex + 1).padStart(2, "0")}` : `Scene ${String(scene?.number || sceneIndex + 1).padStart(2, "0")}`}
            </div>
            <h1 className="g3-reader-stage-title">{sceneTitle(scene, language)}</h1>
            <div className="g3-reader-stage-sub">
              {scene?.title && <span className="g3-reader-sub-hanzi">{scene.title}</span>}
              {scene?.placePy && <span className="g3-reader-sub-pinyin">{scene.placePy}</span>}
            </div>
            {sceneContext(scene, language) && (
              <p className="g3-reader-stage-desc">{sceneContext(scene, language)}</p>
            )}
          </header>

          {/* Current Dialogue Card or Completion Card */}
          {completed ? (
            <section className="g3-reader-completion-card" aria-live="polite">
              <div className="g3-completion-check-icon" aria-hidden="true">✓</div>
              <h2>
                {sceneIndex < scenes.length - 1
                  ? (language === "th" ? `จบฉากที่ ${sceneIndex + 1} แล้ว` : `Completed Scene ${sceneIndex + 1}`)
                  : (language === "th" ? "เรียนบทนี้จบแล้ว" : "Lesson Complete")}
              </h2>
              <p>
                {sceneIndex < scenes.length - 1
                  ? (language === "th" ? "พร้อมเรียนฉากถัดไปแล้วหรือยัง?" : "Ready for the next scene?")
                  : (language === "th" ? "คุณเรียนจบทุกฉากในบทเรียนนี้แล้ว" : "You have completed all scenes in this lesson.")}
              </p>
              <div className="g3-completion-actions">
                {sceneIndex < scenes.length - 1 ? (
                  <>
                    <button className="g3-completion-btn-primary" type="button" onClick={() => selectScene(sceneIndex + 1)}>
                      {language === "th" ? "เรียนฉากถัดไป →" : "Next Scene →"}
                    </button>
                    <button className="g3-completion-btn-secondary" type="button" onClick={() => navigate(levelPath(lesson.level))}>
                      {language === "th" ? "กลับหน้าเลือกบท" : "Back to lessons"}
                    </button>
                  </>
                ) : (
                  <button className="g3-completion-btn-primary" type="button" onClick={() => navigate(levelPath(lesson.level))}>
                    {language === "th" ? "กลับหน้าเลือกบท" : "Back to lessons"}
                  </button>
                )}
              </div>
            </section>
          ) : (
            <div className="g3-reader-dialogue-card" aria-live="polite">
              <div className="g3-dialogue-card-top">
                <div className="g3-speaker-tag">
                  <span className="g3-speaker-role">[{currentLine?.role || "A"}]</span>
                  <strong className="g3-speaker-name">
                    {currentProfile ? profileName(currentProfile, language) : currentLine?.speaker || ""}
                  </strong>
                </div>
                <button
                  type="button"
                  className={`g3-card-audio-btn ${playbackStatus === "playing" ? "is-playing" : ""} ${soundBlocked ? "needs-attention" : ""}`}
                  onClick={soundBlocked ? unblockAndPlayAudio : replayCurrentLine}
                  aria-label={soundBlocked ? (language === "th" ? "กดเพื่อเริ่มเสียง" : "Enable sound") : (language === "th" ? "ฟังเสียงประโยคนี้ซ้ำ" : "Replay audio")}
                  title={soundBlocked ? (language === "th" ? "กดเพื่อเริ่มเสียง" : "Enable sound") : (language === "th" ? "ฟังเสียงซ้ำ" : "Replay")}
                >
                  <Icon paths={volumeHighIcon} />
                </button>
              </div>

              {soundBlocked && (
                <button
                  type="button"
                  className="g3-sound-unblock-banner"
                  onClick={unblockAndPlayAudio}
                >
                  <span aria-hidden="true">🔊</span> {language === "th" ? "กดเพื่อเริ่มเสียง" : language === "zh" ? "点击开启声音" : "Click to enable audio"}
                </button>
              )}

              <div className="g3-dialogue-card-body">
                <p className="g3-card-hanzi">{currentLine?.hanzi}</p>
                <p className="g3-card-pinyin">{currentLine?.reading}</p>
                {showTranslation && (
                  <p className="g3-card-thai">{currentLine?.th}</p>
                )}
              </div>
            </div>
          )}

          {/* Dialogue Controls (Previous / Next) */}
          {!completed && (
            <div className="g3-dialogue-step-controls">
              <button
                type="button"
                className="g3-step-btn g3-step-prev"
                disabled={lineIndex <= 0 || Boolean(challenge)}
                onClick={previousLine}
              >
                <span aria-hidden="true">◀</span> {language === "th" ? "ก่อนหน้า" : "Previous"}
              </button>
              <button
                type="button"
                className="g3-step-btn g3-step-next"
                disabled={Boolean(challenge)}
                onClick={nextLine}
              >
                {language === "th" ? "ถัดไป" : "Next"} <span aria-hidden="true">▶</span>
              </button>
            </div>
          )}

          {/* Playback Modes (Listening / Manual) */}
          {!completed && (
            <div className="g3-playback-mode-group">
              <button
                type="button"
                className={`g3-mode-btn ${playbackStatus === "playing" && playbackMode === "autoplay" ? "is-active" : ""}`}
                onClick={toggleAutoplayListening}
              >
                <span aria-hidden="true">🔊</span> {language === "th" ? (playbackStatus === "playing" && playbackMode === "autoplay" ? "กำลังฟังบทสนทนา..." : "ฟังตามบทสนทนา") : "Listen Sequential"}
              </button>
              <button
                type="button"
                className={`g3-mode-btn ${playbackMode === "manual" && playbackStatus !== "playing" ? "is-active" : ""}`}
                onClick={setManualReadingMode}
              >
                <span aria-hidden="true">📖</span> {language === "th" ? "อ่านเองทีละประโยค" : "Manual Reading"}
              </button>
            </div>
          )}

          {/* Progress Line */}
          {!completed && scene?.lines?.length > 0 && (
            <div className="g3-reader-progress-line">
              <span className="g3-progress-text">{Math.min(lineIndex + 1, scene.lines.length)} / {scene.lines.length}</span>
              <div className="g3-progress-bar-track">
                <div
                  className="g3-progress-bar-fill"
                  style={{ width: `${((Math.min(lineIndex + 1, scene.lines.length)) / scene.lines.length) * 100}%` }}
                />
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Challenge Overlays */}
      {challenge?.type === "qte" && (
        <QteChallenge
          challenge={challenge.data}
          language={language}
          timed={timed}
          onResolve={resolveChallenge}
          sourceLine={currentLine}
        />
      )}
      {challenge?.type === "builder" && (
        <SentenceChallenge
          challenge={challenge.data}
          language={language}
          level={lesson.level}
          onResolve={resolveChallenge}
          onRestart={restartScene}
          sourceLine={currentLine}
        />
      )}

      {roleplayActive && createPortal(
        <Suspense fallback={null}>
          <RoleplayView
            characters={characterProfiles}
            language={language}
            lineIndex={lineIndex}
            lines={scene.lines}
            onExit={() => setRoleplayRole(null)}
            onTogglePlayback={toggleAutoplayListening}
            role={roleplayRole}
            scene={scene}
            status={roleplayStatus}
            text={text}
          />
        </Suspense>,
        document.body
      )}
    </main>
  );
}
