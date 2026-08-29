import { practicePath } from "../../../routing/routes.js";
import { formatPracticeProgress } from "./practiceUi.js";

export function PracticeExerciseShell({ children, exerciseType, level, navigate, progress, status, text, title }) {
  return (
    <main className={`g3-practice-exercise is-level-${level} type-${exerciseType}`}>
      <div className="g3-practice-exercise-inner">
        <header className="g3-practice-exercise-header">
          <button className="g3-back-link" type="button" onClick={() => navigate(practicePath(level))}>
            <span aria-hidden="true">←</span>
            <span className="g3-practice-back-label">{text.backToPractice}</span>
          </button>
          <div className="g3-practice-exercise-heading">
            <span>{String(level).toUpperCase()}</span>
            <h1>{title}</h1>
          </div>
          {progress ? <strong className="g3-practice-progress">{formatPracticeProgress(text.practiceProgress, progress.current, progress.total)}</strong> : <span />}
        </header>
        <section className="g3-practice-workspace">{children}</section>
        <div className="g3-practice-live" aria-live="polite">{status}</div>
      </div>
    </main>
  );
}
