import Icon from "../../../../../shared/components/ui/Icon.jsx";
import {
  arrowLeftIcon,
  arrowRightIcon,
  ellipsisIcon,
  pauseIcon,
  playIcon,
  rotateLeftIcon,
  volumeHighIcon,
  volumeXmarkIcon,
} from "../../../../../shared/components/ui/iconPaths.js";

const DEFAULT_SPEEDS = Object.freeze([0.85, 1, 1.15]);

function clampPercent(value) {
  return Math.max(0, Math.min(100, Number(value) || 0));
}

export function StoryPlaybackDock({
  canNext = true,
  canPrevious = true,
  controlsDisabled = false,
  detailsOpen = false,
  lineIndex = -1,
  markers = [],
  onNext,
  onPrevious,
  onReplay,
  onSpeedChange,
  onToggleDetails,
  onTogglePlayback,
  onToggleSound,
  soundBlocked = false,
  soundEnabled = true,
  speaker = null,
  speed = 1,
  speedOptions = DEFAULT_SPEEDS,
  status = "paused",
  text,
  totalLines = 0,
  upcomingCue = "",
}) {
  const lineNumber = lineIndex >= 0 ? lineIndex + 1 : 0;
  const progress = totalLines ? clampPercent((lineNumber / totalLines) * 100) : 0;
  const isPlaying = status === "playing";
  const statusLabel = {
    blocked: text.playbackSoundBlocked,
    challenge: text.playbackChallenge,
    paused: text.playbackPaused,
    playing: text.playbackPlaying,
  }[status] || text.playbackPaused;

  return (
    <aside
      className={`g3-playback-dock is-${status}${detailsOpen ? " is-details-open" : ""}`}
      aria-label={text.storyPlaybackControls}
    >
      <header className="g3-playback-status" role="status" aria-live="polite">
        <span aria-hidden="true" />
        <div>
          <small>{statusLabel}</small>
          <strong>{text.lineProgress} {lineNumber} / {totalLines}</strong>
        </div>
        <button
          className="g3-playback-details-toggle"
          type="button"
          aria-expanded={detailsOpen}
          aria-controls="g3-playback-details"
          aria-label={detailsOpen ? text.hidePlaybackDetails : text.showPlaybackDetails}
          onClick={onToggleDetails}
        >
          <Icon paths={ellipsisIcon} />
        </button>
      </header>

      <div
        className="g3-playback-progress"
        role="progressbar"
        aria-label={text.sceneProgress}
        aria-valuemin="0"
        aria-valuemax={totalLines}
        aria-valuenow={lineNumber}
      >
        <span style={{ width: `${progress}%` }} />
        {markers.map((marker) => (
          <i
            aria-hidden="true"
            key={marker.id}
            title={marker.label}
            style={{ left: `${clampPercent(marker.progress)}%` }}
          />
        ))}
      </div>

      <div className="g3-playback-transport">
        <div className="g3-playback-transport-side">
          <button type="button" onClick={onPrevious} disabled={controlsDisabled || !canPrevious} aria-label={text.previousLine}>
            <Icon paths={arrowLeftIcon} />
          </button>
          <button type="button" onClick={onNext} disabled={controlsDisabled || !canNext} aria-label={text.nextLine}>
            <Icon paths={arrowRightIcon} />
          </button>
        </div>
        <button
          className="is-primary"
          data-g3-playback-primary
          type="button"
          onClick={onTogglePlayback}
          disabled={controlsDisabled}
          aria-label={isPlaying ? text.pausePlayback : text.resumePlayback}
          aria-pressed={isPlaying}
        >
          <Icon paths={isPlaying ? pauseIcon : playIcon} />
        </button>
        <div className="g3-playback-transport-side is-right">
          <button
            className={soundBlocked ? "needs-attention" : ""}
            type="button"
            onClick={onToggleSound}
            disabled={controlsDisabled}
            aria-label={soundBlocked ? text.enableSound : soundEnabled ? text.soundOff : text.soundOn}
            aria-pressed={soundEnabled && !soundBlocked}
          >
            <Icon paths={soundEnabled && !soundBlocked ? volumeHighIcon : volumeXmarkIcon} />
          </button>
        </div>
      </div>

      <div className="g3-playback-dock-details" id="g3-playback-details">
        {speaker && (
          <div className="g3-playback-speaker">
            {speaker.image && (
              <img
                src={speaker.image}
                srcSet={speaker.imageSrcSet}
                alt=""
                width="64"
                height="64"
                loading="lazy"
                decoding="async"
                style={{ objectPosition: speaker.imageFocus }}
              />
            )}
            <span><small>{text.nowSpeaking}</small><strong>{speaker.name}</strong><em>{speaker.supportingName}</em></span>
          </div>
        )}

        {upcomingCue && <p className="g3-playback-cue"><span>{text.upNext}</span><strong>{upcomingCue}</strong></p>}

        <div className="g3-playback-secondary">
          <button type="button" onClick={onReplay} disabled={controlsDisabled || lineIndex < 0}>
            <Icon paths={rotateLeftIcon} />{text.replayLine}
          </button>
          <div role="group" aria-label={text.playbackSpeed}>
            {speedOptions.map((option) => (
              <button
                type="button"
                className={speed === option ? "is-active" : ""}
                aria-pressed={speed === option}
                key={option}
                onClick={() => onSpeedChange?.(option)}
                disabled={controlsDisabled}
              >
                {option}×
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
