import React from "react";
import { SUMMARY_COPY, getScoreLabel, getLearnerName } from "./summaryModel.js";
import "./learning-summary.css";

export function LearningSummary({ language = "th", data, onRetry, onHome }) {
  const text = SUMMARY_COPY[language] || SUMMARY_COPY.th;

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

  const renderTrack = (score) => {
    if (score === null || score === undefined) {
      return (
        <div className="g3-ex-track">
          <div className="g3-ex-fill" style={{ width: "0%", opacity: 0.5 }}></div>
        </div>
      );
    }
    return (
      <div className="g3-ex-track">
        <div className="g3-ex-fill" style={{ width: `${Math.max(0, Math.min(100, score))}%` }}></div>
      </div>
    );
  };

  const renderScore = (score) => {
    return score !== null && score !== undefined ? score : "—";
  };

  const hasScore = overall?.score !== null && overall?.score !== undefined;

  return (
    <div className={`g3-learning-summary ${levelClass}`}>
      <div className="g3-summary-inner">

        <header className="g3-summary-header">
          <button className="g3-summary-back" type="button" onClick={onHome}>
            ← กลับ
          </button>

          <div className="g3-summary-title-block">
            <h1 className="g3-summary-page-title">{text.title}</h1>
            <div className="g3-learner-identity">
              <div className="g3-learner-avatar">
                {(learnerName || getLearnerName(language)).charAt(0)}
              </div>
              <p className="g3-learner-name-text">
                {language === "zh" ? "学习者：" : language === "en" ? "Learner: " : "ผู้เรียน: "}
                <strong>{learnerName || getLearnerName(language)}</strong>
              </p>
            </div>
          </div>

          <div className="g3-summary-overall-score">
            <div className="g3-score-ring">
              {hasScore ? (
                <>
                  <span className="g3-score-value">{overall.score}</span>
                  <span className="g3-score-max">/ 100</span>
                </>
              ) : (
                <span className="g3-score-status" style={{ fontSize: "1rem", textAlign: "center" }}>✓</span>
              )}
            </div>
            <span className="g3-score-status">{getScoreLabel(overall?.score, language)}</span>
          </div>
        </header>

        <section className="g3-summary-exercises">
          <div className="g3-exercise-row">
            <span className="g3-ex-title">{text.exercises.repeatSentence}</span>
            {renderTrack(exercises?.repeatSentence?.score)}
            <span className="g3-ex-score">{renderScore(exercises?.repeatSentence?.score)}</span>
          </div>
          <div className="g3-exercise-row">
            <span className="g3-ex-title">{text.exercises.imageDescription}</span>
            {renderTrack(exercises?.imageDescription?.score)}
            <span className="g3-ex-score">{renderScore(exercises?.imageDescription?.score)}</span>
          </div>
          <div className="g3-exercise-row">
            <span className="g3-ex-title">{text.exercises.questionResponse}</span>
            {renderTrack(exercises?.questionResponse?.score)}
            <span className="g3-ex-score">{renderScore(exercises?.questionResponse?.score)}</span>
          </div>
        </section>

        <section className="g3-summary-skills">
          <h2>ทักษะ (Skills)</h2>
          <div className="g3-skills-grid">
            <div className="g3-skill-bar">
              <span className="g3-skill-label">{text.metrics.accuracy}</span>
              {renderTrack(metrics?.accuracy)}
              <span className="g3-skill-value">{renderScore(metrics?.accuracy)}</span>
            </div>
            <div className="g3-skill-bar">
              <span className="g3-skill-label">{text.metrics.completion}</span>
              {renderTrack(metrics?.completion)}
              <span className="g3-skill-value">{renderScore(metrics?.completion)}</span>
            </div>
            <div className="g3-skill-bar">
              <span className="g3-skill-label">{text.metrics.vocabulary}</span>
              {renderTrack(metrics?.vocabulary)}
              <span className="g3-skill-value">{renderScore(metrics?.vocabulary)}</span>
            </div>
            <div className="g3-skill-bar">
              <span className="g3-skill-label">{text.metrics.timing}</span>
              {renderTrack(metrics?.timing)}
              <span className="g3-skill-value">{renderScore(metrics?.timing)}</span>
            </div>
          </div>
        </section>

        <section className="g3-summary-feedback">
          <div className="g3-feedback-panel is-strengths">
            <h3>{text.strengths}</h3>
            <ul>
              {(strengths?.[language] || strengths?.th || []).length > 0 ? (
                (strengths?.[language] || strengths?.th).map((item, i) => <li key={i}>{item}</li>)
              ) : (
                <li>-</li>
              )}
            </ul>
          </div>
          <div className="g3-feedback-panel is-improvements">
            <h3>{text.improvements}</h3>
            <ul>
              {(improvements?.[language] || improvements?.th || []).length > 0 ? (
                (improvements?.[language] || improvements?.th).map((item, i) => <li key={i}>{item}</li>)
              ) : (
                <li>-</li>
              )}
            </ul>
          </div>
        </section>

        <footer className="g3-summary-actions">
          <button className="g3-secondary-action" type="button" onClick={onRetry}>
            ฝึกอีกครั้ง (Practice Again)
          </button>
          <button className="g3-primary-action" type="button" onClick={onHome}>
            เสร็จสิ้น (Finish)
          </button>
        </footer>

      </div>
    </div>
  );
}
