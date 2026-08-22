import { COPY } from "../../content/copy.js";
import { getPracticeHubEntries } from "../../content/practice/registry.js";
import { practicePath } from "../../routing/routes.js";

function levelLabel(level) {
  return String(level || "").toUpperCase();
}

export function PracticeHub({ language, level, navigate }) {
  const text = COPY[language] || COPY.th;
  const entries = getPracticeHubEntries(level, language);
  const label = levelLabel(level);

  return (
    <main className="g3-catalog g3-practice-hub">
      <section className="g3-catalog-intro">
        <button className="g3-back-link" type="button" onClick={() => navigate("/home/levels/")}>← {text.back}</button>
        <div className="g3-catalog-intro-copy">
          <p className="g3-kicker">{text.practiceHubKicker} · {label}</p>
          <h1 tabIndex="-1">{text.practiceHubTitle}</h1>
          <p>{text.practiceHubBody.replace("{level}", label)}</p>
        </div>
      </section>
      <section className="g3-catalog-browser" aria-label={`${text.practiceHubTitle} ${label}`}>
        <nav className="g3-catalog-tabs" aria-label={text.practiceHubTitle}>
          {entries.map((entry, index) => (
            <button
              className="g3-practice-entry"
              data-progress={entry.progress.state}
              data-source-refs={entry.sourceRefs.map((ref) => ref.lessonId).join(",")}
              key={entry.id}
              onClick={() => navigate(entry.route)}
              type="button"
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{entry.title}</strong>
              <small>{entry.description}</small>
              <em>{text.practiceNotStarted}</em>
            </button>
          ))}
        </nav>
      </section>
    </main>
  );
}

export function PracticeExercisePlaceholder({ exerciseType, language, level, navigate }) {
  const text = COPY[language] || COPY.th;
  const entry = getPracticeHubEntries(level, language).find((item) => item.type === exerciseType);
  const label = levelLabel(level);

  return (
    <main className="g3-catalog g3-practice-placeholder">
      <section className="g3-catalog-intro">
        <button className="g3-back-link" type="button" onClick={() => navigate(practicePath(level))}>← {text.backToPractice}</button>
        <div className="g3-catalog-intro-copy">
          <p className="g3-kicker">{label}</p>
          <h1 tabIndex="-1">{entry?.title || text.practiceHubTitle}</h1>
          <p>{entry?.description || text.practiceHubBody.replace("{level}", label)}</p>
        </div>
      </section>
      <section className="g3-catalog-browser" aria-live="polite">
        <article className="g3-catalog-feature">
          <div className="g3-catalog-feature-copy">
            <h2>{text.practiceComingSoon}</h2>
            <p>{text.practiceComingSoonBody}</p>
            <button type="button" onClick={() => navigate(practicePath(level))}>{text.backToPractice}</button>
          </div>
        </article>
      </section>
    </main>
  );
}
