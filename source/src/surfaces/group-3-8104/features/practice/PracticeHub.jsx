
const MotifRepeatSentence = () => (
  <svg className="g3-motif-svg" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="24" y="16" width="16" height="24" rx="8" stroke="currentColor" strokeWidth="3"/>
    <path d="M16 32v4a16 16 0 0 0 32 0v-4M32 52v8M24 60h16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <g className="g3-motif-waves">
       <line x1="12" y1="36" x2="12" y2="28" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
       <line x1="6" y1="34" x2="6" y2="30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
       <line x1="52" y1="36" x2="52" y2="28" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
       <line x1="58" y1="34" x2="58" y2="30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

const MotifImageDescription = () => (
  <svg className="g3-motif-svg" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 20V4h16M44 4h16v16M60 44v16H44M20 60H4V44" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="32" cy="32" r="4" fill="currentColor" className="g3-motif-focus"/>
  </svg>
);

const MotifQuestionResponse = () => (
  <svg className="g3-motif-svg" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 26a16 16 0 0 1 32 0c0 5-2 9.5-6 12l-6 10-4-8H14a16 16 0 0 1-16-16v-2c0-8.8 7.2-16 16-16h0z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" transform="translate(6, 2)"/>
    <path d="M28 22c0-2.2 1.8-4 4-4s4 1.8 4 4c0 1.5-1.5 2.5-2.5 3.5-1 1-1.5 2-1.5 3.5v1" stroke="currentColor" strokeWidth="3" strokeLinecap="round" transform="translate(6, 2)"/>
    <circle cx="32" cy="38" r="2" fill="currentColor" transform="translate(6, 2)"/>
    <path d="M42 12h4a16 16 0 0 1 16 16v2a16 16 0 0 1-9 14.4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.4" transform="translate(2, 2)"/>
  </svg>
);

const MotifIcon = ({ type }) => {
  if (type === 'repeat-sentence') return <MotifRepeatSentence />;
  if (type === 'image-description') return <MotifImageDescription />;
  if (type === 'question-response') return <MotifQuestionResponse />;
  return null;
};

import { COPY } from "../../content/copy.js";
import { getPracticeHubEntries } from "../../content/practice/registry.js";
import { practicePath } from "../../routing/routes.js";
import "./practice-hub.css";

function levelLabel(level) {
  return String(level || "").toUpperCase();
}

export function PracticeHub({ language, level, navigate }) {
  const text = COPY[language] || COPY.th;
  const entries = getPracticeHubEntries(level, language);
  const label = levelLabel(level);

  return (
    <main className={`g3-catalog g3-practice-hub is-level-${label.toLowerCase()}`}>
      <div className="g3-practice-hub-inner">
        <section className="g3-practice-hub-intro">
          <button className="g3-practice-back" type="button" onClick={() => navigate("/home/levels/")}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            {text.back}
          </button>
          <div className="g3-practice-intro-copy">
            <p className="g3-practice-kicker"><span className="g3-practice-kicker-dot"></span>{label} · แบบฝึกพูด</p>
            <h1 tabIndex="-1">{text.practiceHubTitle}</h1>
          </div>
        </section>

        <section className="g3-practice-grid" role="list" aria-label={`${text.practiceHubTitle} ${label}`}>
          {entries.map((entry, index) => {
            const num = String(index + 1).padStart(2, "0");
            const zhTitle = text[`${entry.type.replace(/-([a-z])/g, g => g[1].toUpperCase())}Zh`] || "";
            const meta1 = text[`${entry.type.replace(/-([a-z])/g, g => g[1].toUpperCase())}Meta1`] || "";
            const meta2 = text[`${entry.type.replace(/-([a-z])/g, g => g[1].toUpperCase())}Meta2`] || "";

            return (
              <article
                className={`g3-practice-card type-${entry.type}`}
                data-progress={entry.progress.state}
                data-source-refs={entry.sourceRefs.map((ref) => ref.lessonId).join(",")}
                key={entry.id}
                role="listitem"
              >
                <div className="g3-practice-card-bg"></div>
                <div className="g3-practice-motif" aria-hidden="true" style={{ pointerEvents: 'none' }}>
                  <MotifIcon type={entry.type} />
                </div>
                <div className="g3-practice-card-scrim"></div>

                <div className="g3-practice-card-content">
                  <header className="g3-practice-card-header">
                    <span className="g3-practice-card-num">{num}</span>
                    <h2 className="g3-practice-card-th">{entry.title}</h2>
                    <h3 className="g3-practice-card-zh">{zhTitle}</h3>
                  </header>

                  <div className="g3-practice-card-body">
                    <p className="g3-practice-card-desc">{entry.description}</p>
                    <ul className="g3-practice-card-meta">
                      <li>{meta1}</li>
                      <li>{meta2}</li>
                    </ul>
                  </div>

                  <button
                    className="g3-practice-card-cta"
                    type="button"
                    onClick={() => navigate(entry.route)}
                  >
                    {text.practiceStart}
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      </div>
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
