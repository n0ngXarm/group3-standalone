import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import Icon from "../../../../shared/components/ui/Icon.jsx";
import {
  languageIcon,
  stopwatchIcon,
  volumeHighIcon,
  waveSquareIcon,
} from "../../../../shared/components/ui/iconPaths.js";
import { QteChallenge, SentenceChallenge } from "./challenges/index.js";
import { SourceStamp } from "../../shared/components/index.js";
import { SceneBriefing } from "../catalog/index.js";
import { StoryPlaybackDock } from "./playback/index.js";
import { GROUP3_PLAYBACK_CONFIG } from "../../config.js";
import { COPY } from "../../content/copy.js";
import {
  dialogueVoicePath,
  GROUP3_VOICE_PROFILES,
  speakChinese,
  stopChineseVoice,
  unlockChineseAudio,
} from "../../services/audio/index.js";
import { lessonPath, levelPath } from "../../routing/routes.js";

const SOUND_FAILURE_STATES = new Set(["blocked", "timeout", "unavailable"]);
const RolePicker = lazy(() => import("./roleplay/index.js").then((module) => ({
  default: module.RolePicker,
})));
const RoleplayView = lazy(() => import("./roleplay/index.js").then((module) => ({
  default: module.RoleplayView,
})));

function sceneTitle(scene, language) {
  return { th: scene.titleTh, zh: scene.title, en: scene.titleEn || scene.title }[language];
}

function sceneSupportingTitle(scene, language) {
  return { th: scene.title, zh: scene.titleTh, en: scene.title }[language];
}

function sceneContext(scene, language) {
  return { th: scene.contextTh, zh: scene.context, en: scene.contextEn || scene.context }[language];
}

function sceneSupportingContext(scene, language) {
  return { th: scene.context, zh: scene.contextTh, en: scene.context }[language];
}

function profileName(profile, language) {
  return { th: profile.nameTh, zh: profile.hanzi, en: profile.nameEn || profile.pinyin }[language];
}

function localizedPrompt(prompt, language, text) {
  return { th: prompt.th, zh: prompt.zh, en: prompt.en || text.educationalUnavailable }[language];
}

function supportingProfileName(profile, language) {
  return {
    th: `${profile.hanzi} · ${profile.pinyin}`,
    zh: profile.pinyin,
    en: profile.hanzi,
  }[language];
}

export function ReadingTheatre({ initialScene, language, lesson, navigate, lowData = false }) {
  const text = COPY[language];
  const scenes = lesson.scenes;
  const characterProfiles = lesson.characters;
  const lineRefs = useRef([]);
  const manualPlaybackSequenceRef = useRef(0);
  const [sceneIndex, setSceneIndex] = useState(initialScene);
  const [lineIndex, setLineIndex] = useState(-1);
  const [resolved, setResolved] = useState([]);
  const [challenge, setChallenge] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [timed, setTimed] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);
  const [playbackMode, setPlaybackMode] = useState("manual");
  const [playbackStatus, setPlaybackStatus] = useState("briefing");
  const [playbackRevision, setPlaybackRevision] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(GROUP3_PLAYBACK_CONFIG.defaultSpeed);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [soundBlocked, setSoundBlocked] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [manualPlaybackIntent, setManualPlaybackIntent] = useState(null);
  const [rolePickerOpen, setRolePickerOpen] = useState(false);
  const [roleplayRole, setRoleplayRole] = useState(null);
  const scene = scenes[sceneIndex];
  const visibleLines = lineIndex < 0 ? [] : scene.lines.slice(0, lineIndex + 1);
  const currentLine = lineIndex >= 0 ? scene.lines[lineIndex] : null;
  const currentCharacter = currentLine
    ? scene.characters.find((item) => item.role === currentLine.role)
    : null;
  const currentVoiceProfile = currentCharacter?.profile || "wang";
  const currentProfile = currentCharacter ? characterProfiles[currentCharacter.profile] : null;
  const firstLineRole = scene?.lines?.[0]?.role || "A";
  const leftRole = roleplayRole || firstLineRole;
  const sortedCharacters = useMemo(() => {
    if (!scene?.characters) return [];
    const left = scene.characters.find((c) => c.role === leftRole);
    const others = scene.characters.filter((c) => c.role !== leftRole);
    return left ? [left, ...others] : scene.characters;
  }, [scene?.characters, leftRole]);

  const cancelAutoScroll = useCallback(() => {
    window.scrollTo({ behavior: "auto", left: window.scrollX, top: window.scrollY });
  }, []);

  const scrollToLine = useCallback((index) => {
    const target = lineRefs.current[index];
    if (!target) return;
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "center",
      inline: "nearest",
    });
  }, []);

  const pendingChallengeType = useCallback((index) => {
    if (index < 0) return null;
    if (index === scene.qte.after && !resolved.includes("qte")) return "qte";
    if (index === scene.lines.length - 1 && !resolved.includes("builder")) return "builder";
    return null;
  }, [resolved, scene]);

  const openChallenge = useCallback((type, resumeAutoplay) => {
    stopChineseVoice();
    cancelAutoScroll();
    setManualPlaybackIntent(null);
    setChallenge({
      data: type === "qte" ? scene.qte : scene.builder,
      resumeAutoplay,
      type,
    });
    setPlaybackStatus(type === "qte" ? "challenge" : "builder");
  }, [cancelAutoScroll, scene]);

  const playbackMarkers = useMemo(() => [
    {
      id: `${scene.id}-qte`,
      label: text.qte,
      progress: ((scene.qte.after + 1) / scene.lines.length) * 100,
    },
    {
      id: `${scene.id}-builder`,
      label: text.builder,
      progress: 100,
    },
  ], [scene, text.builder, text.qte]);

  const currentSpeaker = useMemo(() => {
    if (!currentProfile) return null;
    return {
      image: lowData ? "" : currentProfile.image,
      imageFocus: currentProfile.imageFocus,
      imageSrcSet: lowData ? "" : currentProfile.imageSrcSet,
      name: profileName(currentProfile, language),
      supportingName: supportingProfileName(currentProfile, language),
    };
  }, [currentProfile, language, lowData]);

  const upcomingCue = useMemo(() => {
    if (!currentLine) return "";
    if (lineIndex === scene.qte.after && !resolved.includes("qte")) {
      return localizedPrompt(scene.qte.prompt, language, text);
    }
    if (lineIndex < scene.lines.length - 1) return scene.lines[lineIndex + 1].hanzi;
    if (!resolved.includes("builder")) return localizedPrompt(scene.builder.prompt, language, text);
    return "";
  }, [currentLine, language, lineIndex, resolved, scene, text]);

  const queueManualPlayback = useCallback((index, profileId) => {
    const line = scene.lines[index];
    if (!line) return;
    unlockChineseAudio();
    manualPlaybackSequenceRef.current += 1;
    setLineIndex(index);
    setPlaybackMode("manual");
    setPlaybackStatus("paused");
    setSoundEnabled(true);
    setSoundBlocked(false);
    setManualPlaybackIntent({
      audioSrc: dialogueVoicePath(lesson, sceneIndex, index),
      hanzi: line.hanzi,
      lineIndex: index,
      profileId,
      rate: playbackSpeed,
      revision: manualPlaybackSequenceRef.current,
      sceneId: scene.id,
    });
  }, [lesson, playbackSpeed, scene, sceneIndex]);

  useEffect(() => {
    setSceneIndex(initialScene);
  }, [initialScene]);

  useEffect(() => {
    stopChineseVoice();
    cancelAutoScroll();
    lineRefs.current = [];
    setLineIndex(-1);
    setResolved([]);
    setChallenge(null);
    setCompleted(false);
    setPlaybackMode("manual");
    setPlaybackStatus("briefing");
    setSoundBlocked(false);
    setDetailsOpen(false);
    window.scrollTo({ top: 0, behavior: "auto" });
    document.querySelector(".g3-reading-stage")?.scrollTo({ top: 0, behavior: "auto" });
  }, [cancelAutoScroll, sceneIndex]);

  useEffect(() => {
    if (lineIndex < 0) return undefined;
    const frame = window.requestAnimationFrame(() => scrollToLine(lineIndex));
    return () => {
      window.cancelAnimationFrame(frame);
      cancelAutoScroll();
    };
  }, [cancelAutoScroll, lineIndex, scene.id, scrollToLine]);

  useEffect(() => {
    if (playbackStatus !== "playing" || lineIndex < 0 || challenge || completed) return undefined;

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
        audioResult = await playback.completion;
        if (cancelled || audioResult.status === "cancelled") return;
        if (SOUND_FAILURE_STATES.has(audioResult.status)) setSoundBlocked(true);
      }

      if (SOUND_FAILURE_STATES.has(audioResult.status) || audioResult.status === "muted") {
        const stayed = await wait(GROUP3_PLAYBACK_CONFIG.silentLineMs / playbackSpeed);
        if (!stayed || cancelled) return;
      }

      const stayed = await wait(GROUP3_PLAYBACK_CONFIG.lineGapMs);
      if (!stayed || cancelled) return;
      const nextChallenge = pendingChallengeType(lineIndex);
      if (nextChallenge) {
        const QTE_POST_SPEECH_DELAY_MS = 4000;
        const stayedQte = await wait(QTE_POST_SPEECH_DELAY_MS);
        if (!stayedQte || cancelled) return;
        
        // Guard against duplicate async completion
        // If the playback status changed or challenge is already open, bail out
        if (cancelled) return; 
        openChallenge(nextChallenge, true);
      } else if (lineIndex < scene.lines.length - 1) {
        setLineIndex((value) => value + 1);
      } else {
        setCompleted(true);
        setPlaybackStatus("complete");
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
    currentLine,
    currentVoiceProfile,
    lineIndex,
    lesson,
    openChallenge,
    pendingChallengeType,
    playbackRevision,
    playbackSpeed,
    playbackStatus,
    scene.id,
    sceneIndex,
    scene.lines.length,
    soundEnabled,
  ]);

  useEffect(() => {
    const intent = manualPlaybackIntent;
    if (!intent || intent.sceneId !== scene.id) return undefined;
    let cancelled = false;
    scrollToLine(intent.lineIndex);
    const playback = speakChinese(intent.hanzi, {
      audioSrc: intent.audioSrc,
      maxDurationMs: GROUP3_PLAYBACK_CONFIG.audioTimeoutMs,
      profileId: intent.profileId,
      rate: intent.rate,
    });
    playback.completion.then((result) => {
      if (!cancelled && SOUND_FAILURE_STATES.has(result.status)) setSoundBlocked(true);
    });
    return () => {
      cancelled = true;
      playback.cancel();
    };
  }, [manualPlaybackIntent, scene.id, scrollToLine]);

  useEffect(() => {
    if (playbackMode !== "manual" || playbackStatus !== "paused" || challenge || completed) return undefined;
    const nextChallenge = pendingChallengeType(lineIndex);
    if (!nextChallenge) return undefined;
    const timer = window.setTimeout(
      () => openChallenge(nextChallenge, false),
      GROUP3_PLAYBACK_CONFIG.challengeDelayMs,
    );
    return () => window.clearTimeout(timer);
  }, [challenge, completed, lineIndex, openChallenge, pendingChallengeType, playbackMode, playbackStatus]);

  useEffect(() => {
    const pauseWhenHidden = () => {
      if (!document.hidden) return;
      stopChineseVoice();
      cancelAutoScroll();
      setPlaybackStatus((status) => status === "playing" ? "paused" : status);
    };
    document.addEventListener("visibilitychange", pauseWhenHidden);
    return () => document.removeEventListener("visibilitychange", pauseWhenHidden);
  }, [cancelAutoScroll]);

  useEffect(() => () => {
    stopChineseVoice();
    cancelAutoScroll();
  }, [cancelAutoScroll]);

  const beginReading = (mode) => {
    unlockChineseAudio();
    setManualPlaybackIntent(null);
    if (mode === "autoplay") {
      startRoleplay(scene?.learnerRole || scene?.playerRole || (scene?.characters?.find(c => c.role !== (scene?.lines?.[0]?.role || "A"))?.role) || "B");
      return;
    }
    setPlaybackMode(mode);
    setPlaybackStatus(mode === "autoplay" ? "playing" : "paused");
    setSoundBlocked(false);
    setLineIndex(0);
  };

  const startRoleplay = (role) => {
    unlockChineseAudio();
    setRolePickerOpen(false);
    setRoleplayRole(role);
    setManualPlaybackIntent(null);
    setPlaybackMode("autoplay");
    setPlaybackStatus("playing");
    setSoundBlocked(false);
    setLineIndex(0);
  };

  const exitRoleplay = () => {
    stopChineseVoice();
    cancelAutoScroll();
    setRoleplayRole(null);
    setPlaybackStatus((status) => (status === "playing" ? "paused" : status));
  };

  const resolveChallenge = () => {
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
  };

  const previousLine = () => {
    stopChineseVoice();
    cancelAutoScroll();
    setManualPlaybackIntent(null);
    setPlaybackMode("manual");
    setPlaybackStatus("paused");
    setLineIndex((value) => Math.max(0, value - 1));
  };

  const nextLine = () => {
    stopChineseVoice();
    cancelAutoScroll();
    setManualPlaybackIntent(null);
    const nextChallenge = pendingChallengeType(lineIndex);
    if (nextChallenge) {
      openChallenge(nextChallenge, false);
      return;
    }
    setPlaybackMode("manual");
    setPlaybackStatus("paused");
    if (lineIndex < scene.lines.length - 1) setLineIndex((value) => value + 1);
    else {
      setCompleted(true);
      setPlaybackStatus("complete");
    }
  };

  const replayCurrentLine = () => {
    if (!currentLine) return;
    unlockChineseAudio();
    queueManualPlayback(lineIndex, currentVoiceProfile);
  };

  const togglePlayback = () => {
    if (soundBlocked) {
      setSoundBlocked(false);
      setSoundEnabled(true);
      setManualPlaybackIntent(null);
      setPlaybackMode("autoplay");
      setPlaybackStatus("playing");
      setPlaybackRevision((value) => value + 1);
      return;
    }
    if (playbackStatus === "playing") {
      stopChineseVoice();
      cancelAutoScroll();
      setPlaybackStatus("paused");
      return;
    }
    unlockChineseAudio();
    setPlaybackMode("autoplay");
    setPlaybackStatus("playing");
    setPlaybackRevision((value) => value + 1);
  };

  const toggleSound = () => {
    stopChineseVoice();
    if (soundBlocked || !soundEnabled) {
      unlockChineseAudio();
      setSoundBlocked(false);
      setSoundEnabled(true);
      if (playbackStatus === "playing") setPlaybackRevision((value) => value + 1);
      else queueManualPlayback(lineIndex, currentVoiceProfile);
      return;
    }
    setSoundEnabled(false);
    if (playbackStatus === "playing") setPlaybackRevision((value) => value + 1);
  };

  const selectScene = (nextIndex) => {
    stopChineseVoice();
    cancelAutoScroll();
    setRoleplayRole(null);
    setRolePickerOpen(false);
    const url = new URL(window.location.href);
    url.searchParams.set("scene", String(nextIndex + 1));
    history.replaceState({ g3: true }, "", `${url.pathname}${url.search}`);
    setSceneIndex(nextIndex);
  };

  const restartScene = () => {
    stopChineseVoice();
    cancelAutoScroll();
    setRoleplayRole(null);
    setRolePickerOpen(false);
    setLineIndex(-1);
    setResolved([]);
    setChallenge(null);
    setCompleted(false);
    setPlaybackMode("manual");
    setPlaybackStatus("briefing");
    setSoundBlocked(false);
    setManualPlaybackIntent(null);
  };

  const restartRoleplay = () => {
    stopChineseVoice();
    cancelAutoScroll();
    setResolved([]);
    setChallenge(null);
    setManualPlaybackIntent(null);
    setLineIndex(0);
    setPlaybackMode("autoplay");
    setPlaybackStatus("playing");
    setPlaybackRevision((value) => value + 1);
  };

  const roleplayActive = Boolean(roleplayRole) && !challenge && !completed && lineIndex >= 0;
  const roleplayStatus = soundBlocked ? "blocked" : playbackStatus === "briefing" ? "paused" : playbackStatus;

  return (
    <main className={`g3-reader${roleplayActive ? " is-roleplay" : ""}`} data-status={playbackStatus}>
      <aside className="g3-reader-rail" aria-label={text.catalogTitle}>
        <button className="g3-reader-exit" type="button" onClick={() => navigate(lessonPath(lesson, "contents"))} aria-label={text.exitReader}>←<span>{text.exitReader}</span></button>
        <div className="g3-rail-scenes">
          {scenes.map((item, index) => (
            <button type="button" key={item.id} className={sceneIndex === index ? "active" : ""} onClick={() => selectScene(index)}>
              <span>{item.number}</span><i>{item.glyph}</i><small>{sceneTitle(item, language)}</small>
            </button>
          ))}
        </div>
        <SourceStamp compact lesson={lesson} />
      </aside>

      <section className="g3-reading-stage" aria-labelledby="g3-scene-title" data-source-ref={scene.sourceRef}>
        {playbackStatus === "briefing" ? (
          <SceneBriefing characters={characterProfiles} scene={scene} language={language} text={text} onBegin={beginReading} lowData={lowData} />
        ) : (
          <>
            <header className="g3-stage-heading">
              <div>
                <p>{text.stage} {scene.number} · {{ th: scene.placeTh, zh: scene.place, en: scene.place }[language]}{scene.placePy && <span className="g3-place-pinyin"> · {scene.placePy}</span>}</p>
                <h1 id="g3-scene-title" tabIndex="-1">{sceneTitle(scene, language)}</h1>
                <strong>{sceneSupportingTitle(scene, language)}</strong>
              </div>
              <div className="g3-stage-meta">
                <span>{text.sourcePage}<b>{scene.sourcePage}</b></span>
                <button type="button" onClick={() => setShowTranslation((value) => !value)} className={showTranslation ? "is-on" : ""}><Icon paths={languageIcon} />{showTranslation ? text.translationOn : text.translationOff}</button>
                <button type="button" onClick={() => setTimed((value) => !value)} className={timed ? "is-on" : ""}><Icon paths={stopwatchIcon} />{timed ? text.timerOn : text.timerOff}</button>
              </div>
            </header>

            <div className="g3-story-context">
              <span aria-hidden="true">地</span>
              <div><strong>{sceneContext(scene, language)}</strong><p>{sceneSupportingContext(scene, language)}</p></div>
              <small>{scene.source}</small>
            </div>

            <div className="g3-role-map" aria-label={text.roleMap}>
              <span>{text.roleMap}</span>
              {sortedCharacters.map((character, index) => {
                const profile = characterProfiles[character.profile];
                const voice = GROUP3_VOICE_PROFILES[character.profile];
                return (
                  <div key={character.role}>
                    {!lowData && <img src={profile.image} srcSet={profile.imageSrcSet} alt="" width="640" height="640" loading="lazy" decoding="async" style={{ objectPosition: profile.imageFocus }} />}
                    <b>{character.role}</b>
                    <span><strong>{profileName(profile, language)}</strong><small>{{ th: profile.hanzi, zh: profile.pinyin, en: profile.hanzi }[language]}</small><em className="g3-role-voice"><Icon paths={waveSquareIcon} />{voice?.label || "TTS"}</em></span>
                    {index === 0 && <i aria-hidden="true">↔</i>}
                  </div>
                );
              })}
            </div>

            <div className="g3-dialogue-stage">
              {visibleLines.map((line, index) => {
                const character = scene.characters.find((item) => item.role === line.role);
                const voiceProfile = line.voiceProfiles?.[0] || character?.profile || "wang";
                const profile = character ? characterProfiles[character.profile] : characterProfiles[voiceProfile];
                const voice = GROUP3_VOICE_PROFILES[voiceProfile];
                const isLeft = line.role === leftRole;
                return (
                  <article
                    aria-current={index === lineIndex ? "step" : undefined}
                    aria-live={index === lineIndex ? "polite" : undefined}
                    key={`${scene.id}-${index}`}
                    ref={(node) => { lineRefs.current[index] = node; }}
                    className={`g3-dialogue-line ${isLeft ? "is-left" : "is-right"} role-${line.role.toLowerCase()}${index === lineIndex ? " is-current" : ""}`}
                  >
                    <div className="g3-speaker-mark">
                      {profile && !lowData && <img src={profile.image} srcSet={profile.imageSrcSet} alt="" width="640" height="640" loading="lazy" decoding="async" style={{ objectPosition: profile.imageFocus }} />}
                      <span>{line.role}</span>
                      <strong>{profile ? profileName(profile, language) : line.speaker}</strong>
                      <small>{profile ? supportingProfileName(profile, language) : line.speaker}</small>
                    </div>
                    <div className="g3-line-copy">
                      <button type="button" onClick={() => {
                        queueManualPlayback(index, voiceProfile);
                      }} aria-label={`${text.speak}: ${line.hanzi} · ${voice?.label || "TTS"}`} title={`${text.voiceCast} · ${voice?.label || "TTS"}`}><Icon paths={volumeHighIcon} /></button>
                      <strong>{line.hanzi}</strong><em>{line.reading}</em>
                      {showTranslation && <div className="g3-line-translation"><span>{text.thaiMeaning}</span><p>{line.th}</p></div>}
                    </div>
                    <figure className="g3-dialogue-visual">
                      {!lowData && <img src={scene.image} srcSet={scene.imageSrcSet} sizes="(max-width: 760px) 100vw, 35vw" alt={scene.imageAlt[language]} width="1400" height={scene.imageSrcSet ? "788" : "900"} loading="lazy" decoding="async" style={{ objectPosition: line.visual.focus }} />}
                      <figcaption><span>{text.visualMemory}</span><strong>{{ th: line.visual.th, zh: line.visual.zh, en: line.visual.zh }[language]}</strong><small>{{ th: line.visual.zh, zh: line.visual.th, en: text.educationalUnavailable }[language]}</small></figcaption>
                    </figure>
                  </article>
                );
              })}
            </div>

            {completed && (
              <section className="g3-scene-complete" aria-live="polite">
                <span aria-hidden="true">读</span><div><p>{text.sceneCompleteLabel} {scene.number}</p><h2>{text.completed}</h2><strong>{text.completedBody}</strong></div>
                <div>
                  <button type="button" onClick={restartScene}>{text.restart}</button>
                  {sceneIndex < scenes.length - 1
                    ? <button className="is-primary" data-g3-scene-complete-primary type="button" onClick={() => selectScene(sceneIndex + 1)}>{text.continueScene} →</button>
                    : (
                      <>
                        <button type="button" onClick={() => navigate(lessonPath(lesson, "contents"))}>{text.back}</button>
                        <button type="button" onClick={() => navigate(levelPath(lesson.hsk))}>{text.hskLevel || "เลือกระดับ HSK"}</button>
                      </>
                    )}
                </div>
              </section>
            )}
          </>
        )}
      </section>

      {currentLine && !completed && (
        <StoryPlaybackDock
          canNext={!challenge}
          canPrevious={lineIndex > 0 && !challenge}
          controlsDisabled={Boolean(challenge)}
          detailsOpen={detailsOpen}
          lineIndex={lineIndex}
          markers={playbackMarkers}
          onNext={nextLine}
          onPrevious={previousLine}
          onReplay={replayCurrentLine}
          onSpeedChange={setPlaybackSpeed}
          onToggleDetails={() => setDetailsOpen((value) => !value)}
          onTogglePlayback={togglePlayback}
          onToggleSound={toggleSound}
          soundBlocked={soundBlocked}
          soundEnabled={soundEnabled}
          speaker={currentSpeaker}
          speed={playbackSpeed}
          speedOptions={GROUP3_PLAYBACK_CONFIG.speedOptions}
          status={challenge ? "challenge" : soundBlocked ? "blocked" : playbackStatus}
          text={text}
          totalLines={scene.lines.length}
          upcomingCue={upcomingCue}
        />
      )}

      {challenge?.type === "qte" && (
        <QteChallenge
          challenge={challenge.data}
          language={language}
          timed={timed}
          onResolve={resolveChallenge}
          onRestart={roleplayRole ? restartRoleplay : undefined}
          sourceLine={currentLine}
        />
      )}
      {challenge?.type === "builder" && <SentenceChallenge challenge={challenge.data} language={language} level={lesson.level} onResolve={resolveChallenge} onRestart={restartScene} sourceLine={currentLine} />}

      {roleplayActive && createPortal(
        <Suspense fallback={null}>
          <RoleplayView
            characters={characterProfiles}
            language={language}
            lineIndex={lineIndex}
            lines={scene.lines}
            onExit={exitRoleplay}
            onTogglePlayback={togglePlayback}
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
