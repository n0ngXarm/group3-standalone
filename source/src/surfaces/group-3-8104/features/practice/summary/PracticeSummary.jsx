import React from "react";
import { SUMMARY_COPY, getScoreLabel, getLearnerName } from "./summaryModel.js";
import "./practice-summary.css";

export function PracticeSummary({ language = "th", data, onRetry, onHome }) {
  const text = SUMMARY_COPY[language] || SUMMARY_COPY.th;

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!data) return null;

  const {
    learnerName,
    hskLevel,
    overall,
    exercises,
    metrics,
    strengths,
    improvements
  } = data;

  const levelClass = hskLevel ? `is-level-${hskLevel}` : "is-level-hsk1";
  const levelUpper = (hskLevel || "hsk1").toUpperCase();

  const hasScore = overall?.score !== null && overall?.score !== undefined;
  const hasResults = overall?.hasResults !== false;

  const renderTrack = (score, maxScore = 100) => {
    const validScore = typeof score === "number" ? Math.max(0, Math.min(maxScore, score)) : 0;
    const percent = maxScore > 0 ? (validScore / maxScore) * 100 : 0;
    return (
      <div className="g3-ex-track">
        <div
          className="g3-ex-fill"
          style={{
            width: `${percent}%`,
            opacity: typeof score === "number" ? 1 : 0.25
          }}
        />
      </div>
    );
  };

  const renderScoreBadge = (score, isAttempted, maxScore = 100) => {
    if (typeof score === "number") {
      if (score === 0) {
        return <span className="g3-score-pill is-empty">0 / {maxScore}</span>;
      }
      return <span className="g3-score-pill is-scored">{score} / {maxScore}</span>;
    }
    if (isAttempted) {
      return <span className="g3-score-pill is-completed">✓ {text.completedNoScore}</span>;
    }
    return <span className="g3-score-pill is-empty">{text.notPracticed}</span>;
  };

  const getScoreColorClass = (score, maxScore = 40) => {
    const percent = maxScore > 0 ? (score / maxScore) * 100 : 0;
    if (percent >= 80) return "is-high";
    if (percent >= 60) return "is-medium";
    return "is-low";
  };

  const displayName = String(learnerName || getLearnerName(language) || text.learner);
  const avatarChar = displayName.trim().charAt(0).toUpperCase() || "U";
  const overallMax = overall?.maxScore || 40;

  return (
    <div className={`g3-learning-summary ${levelClass}`}>
      <div className="g3-summary-inner">

        {/* Top Navigation & Header */}
        <header className="g3-summary-header">
          <button className="g3-summary-back" type="button" onClick={onHome}>
            ← {language === "zh" ? "返回" : language === "en" ? "Back" : "กลับ"}
          </button>

          <div className="g3-summary-title-block">
            <div className="g3-summary-badge-row">
              <span className="g3-level-badge">{levelUpper}</span>
              <span className="g3-summary-tag">{text.title}</span>
            </div>
            <h1 className="g3-summary-page-title">{text.title}</h1>

            <div className="g3-learner-identity">
              <div className="g3-learner-avatar">
                {avatarChar}
              </div>
              <div className="g3-learner-info">
                <span className="g3-learner-label">{text.learner}</span>
                <strong className="g3-learner-name">{displayName}</strong>
              </div>
            </div>
          </div>

          <div className="g3-summary-overall-score">
            <div className={`g3-score-ring ${hasScore ? getScoreColorClass(overall.score, overallMax) : ""}`}>
              {hasScore ? (
                <>
                  <span className="g3-score-value">{overall.score}</span>
                  <span className="g3-score-max">/ {overallMax}</span>
                </>
              ) : hasResults ? (
                <span className="g3-score-status-icon">✓</span>
              ) : (
                <span className="g3-score-status-icon">—</span>
              )}
            </div>
            <div className="g3-score-status-badge">
              {getScoreLabel(overall?.score, language, hasResults, overallMax)}
            </div>
          </div>
        </header>

        {/* Empty State Banner if no results */}
        {!hasResults && (
          <section className="g3-summary-empty-banner">
            <div className="g3-empty-icon">🎯</div>
            <div className="g3-empty-content">
              <h3>{text.emptyTitle}</h3>
              <p>{text.emptyDesc}</p>
            </div>
          </section>
        )}

        {/* Section 1: Exercise Performance Breakdown */}
        <section className="g3-summary-section">
          <div className="g3-section-heading">
            <h2>{text.exercises}</h2>
            <span className="g3-section-subtitle">
              {language === "th" ? "คะแนนและความก้าวหน้าของแต่ละบททดสอบ" : language === "zh" ? "各题型完成度与得分" : "Scores & progress for each exercise"}
            </span>
          </div>

          <div className="g3-exercises-cards">
            {/* Repeat Sentence Card: 10 items, 2 pts each -> Max 20 pts */}
            <div className="g3-exercise-card">
              <div className="g3-exercise-card-header">
                <div className="g3-card-title-group">
                  <span className="g3-card-icon" aria-hidden="true">🎧</span>
                  <h3 className="g3-card-title">{text.repeatSentence}</h3>
                </div>
                {renderScoreBadge(exercises?.repeatSentence?.score, exercises?.repeatSentence?.attempted, 20)}
              </div>
              <p className="g3-card-desc">{text.repeatSentenceDesc}</p>
              <div className="g3-card-track-container">
                {renderTrack(exercises?.repeatSentence?.score, 20)}
                <div className="g3-track-labels">
                  <span>0</span>
                  <span>{typeof exercises?.repeatSentence?.score === "number" ? `${exercises.repeatSentence.score} / 20` : "—"}</span>
                  <span>20</span>
                </div>
              </div>
            </div>

            {/* Image Description Card: 2 items, 5 pts each -> Max 10 pts */}
            <div className="g3-exercise-card">
              <div className="g3-exercise-card-header">
                <div className="g3-card-title-group">
                  <span className="g3-card-icon" aria-hidden="true">🖼️</span>
                  <h3 className="g3-card-title">{text.imageDescription}</h3>
                </div>
                {renderScoreBadge(exercises?.imageDescription?.score, exercises?.imageDescription?.attempted, 10)}
              </div>
              <p className="g3-card-desc">{text.imageDescriptionDesc}</p>
              <div className="g3-card-track-container">
                {renderTrack(exercises?.imageDescription?.score, 10)}
                <div className="g3-track-labels">
                  <span>0</span>
                  <span>{typeof exercises?.imageDescription?.score === "number" ? `${exercises.imageDescription.score} / 10` : "—"}</span>
                  <span>10</span>
                </div>
              </div>
            </div>

            {/* Question Response Card: 2 items, 5 pts each -> Max 10 pts */}
            <div className="g3-exercise-card">
              <div className="g3-exercise-card-header">
                <div className="g3-card-title-group">
                  <span className="g3-card-icon" aria-hidden="true">💬</span>
                  <h3 className="g3-card-title">{text.questionResponse}</h3>
                </div>
                {renderScoreBadge(exercises?.questionResponse?.score, exercises?.questionResponse?.attempted, 10)}
              </div>
              <p className="g3-card-desc">{text.questionResponseDesc}</p>
              <div className="g3-card-track-container">
                {renderTrack(exercises?.questionResponse?.score, 10)}
                <div className="g3-track-labels">
                  <span>0</span>
                  <span>{typeof exercises?.questionResponse?.score === "number" ? `${exercises.questionResponse.score} / 10` : "—"}</span>
                  <span>10</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Core Skills Evaluation */}
        <section className="g3-summary-section">
          <div className="g3-section-heading">
            <h2>{text.skills}</h2>
            <span className="g3-section-subtitle">
              {language === "th" ? "การวิเคราะห์มิติการเรียนรู้ทางภาษา 4 ด้าน" : language === "zh" ? "四大维度语言能力分析" : "4-dimension language skills analysis"}
            </span>
          </div>

          <div className="g3-skills-grid">
            {/* Accuracy */}
            <div className="g3-skill-card">
              <div className="g3-skill-card-top">
                <div className="g3-skill-title-group">
                  <span className="g3-skill-icon" aria-hidden="true">🎯</span>
                  <h4 className="g3-skill-title">{text.accuracy}</h4>
                </div>
                <span className="g3-skill-score-num">
                  {typeof metrics?.accuracy === "number" ? `${metrics.accuracy}%` : "—"}
                </span>
              </div>
              <p className="g3-skill-desc">{text.accuracyDesc}</p>
              {renderTrack(metrics?.accuracy)}
            </div>

            {/* Completion */}
            <div className="g3-skill-card">
              <div className="g3-skill-card-top">
                <div className="g3-skill-title-group">
                  <span className="g3-skill-icon" aria-hidden="true">📝</span>
                  <h4 className="g3-skill-title">{text.completion}</h4>
                </div>
                <span className="g3-skill-score-num">
                  {typeof metrics?.completion === "number" ? `${metrics.completion}%` : "—"}
                </span>
              </div>
              <p className="g3-skill-desc">{text.completionDesc}</p>
              {renderTrack(metrics?.completion)}
            </div>

            {/* Vocabulary */}
            <div className="g3-skill-card">
              <div className="g3-skill-card-top">
                <div className="g3-skill-title-group">
                  <span className="g3-skill-icon" aria-hidden="true">📚</span>
                  <h4 className="g3-skill-title">{text.vocabulary}</h4>
                </div>
                <span className="g3-skill-score-num">
                  {typeof metrics?.vocabulary === "number" ? `${metrics.vocabulary}%` : "—"}
                </span>
              </div>
              <p className="g3-skill-desc">{text.vocabularyDesc}</p>
              {renderTrack(metrics?.vocabulary)}
            </div>

            {/* Timing / Fluency */}
            <div className="g3-skill-card">
              <div className="g3-skill-card-top">
                <div className="g3-skill-title-group">
                  <span className="g3-skill-icon" aria-hidden="true">⏱️</span>
                  <h4 className="g3-skill-title">{text.timing}</h4>
                </div>
                <span className="g3-skill-score-num">
                  {typeof metrics?.timing === "number" ? `${metrics.timing}%` : "—"}
                </span>
              </div>
              <p className="g3-skill-desc">{text.timingDesc}</p>
              {renderTrack(metrics?.timing)}
            </div>
          </div>
        </section>

        {/* Section 3: Strengths & Recommendations */}
        <section className="g3-summary-section">
          <div className="g3-summary-feedback">
            {/* Strengths Panel */}
            <div className="g3-feedback-panel is-strengths">
              <div className="g3-feedback-panel-header">
                <span className="g3-feedback-badge">🌟</span>
                <h3>{text.strengths}</h3>
              </div>
              <ul className="g3-feedback-list">
                {(strengths?.[language] || strengths?.th || []).map((item, i) => (
                  <li key={i}>
                    <span className="g3-bullet-icon">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Improvements Panel */}
            <div className="g3-feedback-panel is-improvements">
              <div className="g3-feedback-panel-header">
                <span className="g3-feedback-badge">💡</span>
                <h3>{text.improvements}</h3>
              </div>
              <ul className="g3-feedback-list">
                {(improvements?.[language] || improvements?.th || []).map((item, i) => (
                  <li key={i}>
                    <span className="g3-bullet-icon">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Footer Actions */}
        <footer className="g3-summary-actions">
          <button className="g3-secondary-action" type="button" onClick={onRetry}>
            {hasResults ? text.actionRetry : text.actionStart}
          </button>
          <button className="g3-primary-action" type="button" onClick={onHome}>
            {text.actionHome}
          </button>
        </footer>

      </div>
    </div>
  );
}
