import { useEffect, useRef } from "react";
import Icon from "../../../../shared/components/ui/Icon.jsx";
import {
  circleHalfStrokeIcon,
  circleInfoIcon,
  languageIcon,
  moonIcon,
  sunIcon,
} from "../../../../shared/components/ui/iconPaths.js";
import { COPY } from "../../content/copy.js";
import { FEATURED_LESSON, GROUP3_LESSONS } from "../../content/registry.js";
import { frontMatterRoutes, lessonPath } from "../../routing/routes.js";
import { surfaceAssetPath } from "../../../../shared/lib/surface-url.js";
import { getLearnerSession } from "../../shared/session.js";

export function SourceStamp({ compact = false, lesson = null, route = null }) {
  if (route?.name === "home" || !lesson) {
    return (
      <span className={`g3-source-stamp${compact ? " is-compact" : ""}`}>
        <i aria-hidden="true">PDF</i>
        <span><b>新HSK教程 1–3</b><small>New HSK Course 1–3 · 48 Lessons</small></span>
      </span>
    );
  }
  const source = lesson.source || { title: "Loading...", lesson: "...", printedPages: "..." };
  return (
    <span className={`g3-source-stamp${compact ? " is-compact" : ""}`} data-source-ref={lesson.sourceRef || ""}>
      <i aria-hidden="true">PDF</i>
      <span><b>{source.title}</b><small>{source.lesson} · pp. {source.printedPages}</small></span>
    </span>
  );
}


export function StoryHeader({ route, lesson, theme, language, onTheme, onLanguage, onHome, onAbout }) {
  const text = COPY[language];
  const isHome = route?.name === "home";
  const routeLabel = route?.name === "reader"
    ? `${text.stage} 0${(route.scene || 0) + 1}`
    : route?.name && !isHome
      ? text.routeLabels[route.name] || text.routeLabels.home
      : null;

  return (
    <header className={`g3-header${isHome ? " is-home-header" : ""}`}>
      <div className="group-title-dropdown-wrap">
        <button
          aria-label={text.routeLabels.home}
          className="g3-brand"
          onClick={onHome}
          type="button"
        >
          <img src={surfaceAssetPath(3, "/assets/group3/shared/home/brand-logo.png")} className="g3-brand-mark" alt="" aria-hidden="true" width="58" height="58" decoding="async" />
          <span>
            <strong>{text.brand}</strong>
            {text.group ? <small>{text.group}</small> : null}
          </span>
        </button>
      </div>

      {routeLabel ? (
        <div className="g3-route-mark" aria-hidden="true">
          <span>{routeLabel}</span>
        </div>
      ) : (
        <div className="g3-route-mark-spacer" />
      )}
      {!isHome && (
        (() => {
          const name = getLearnerSession();
          if (!name) return null;
          const initial = name.charAt(0).toUpperCase();
          const levelText = route?.level ? route.level.toUpperCase() : "ผู้เรียน";
          return (
            <div className="g3-learner-identity" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--g3-color-primary-base, #cfa05d)',
                color: 'white',
                fontWeight: 'bold'
              }}>
                {initial}
              </span>
              <span style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                <b style={{ color: 'var(--g3-color-text-primary)' }}>{name}</b>
                <small style={{ color: 'var(--g3-color-text-secondary)', fontSize: '11px' }}>{levelText}</small>
              </span>
            </div>
          );
        })()
      )}

      <nav className="g3-header-actions" aria-label={text.navigation}>
        <button type="button" onClick={onTheme} aria-label={theme === "dark" ? text.light : text.dark} title={theme === "dark" ? text.light : text.dark}>
          <Icon paths={theme === "dark" ? sunIcon : moonIcon} />
        </button>
        <div className="g3-language-control" aria-label={text.switchLanguage} title={text.switchLanguage}>
          <button
            type="button"
            className={language === "th" ? "is-active" : ""}
            onClick={() => onLanguage("th")}
            aria-pressed={language === "th"}
          >🇹🇭 TH</button>
          <button
            type="button"
            className={language === "zh" ? "is-active" : ""}
            onClick={() => onLanguage("zh")}
            aria-pressed={language === "zh"}
          >🇨🇳 中</button>
          <button
            type="button"
            className={language === "en" ? "is-active" : ""}
            onClick={() => onLanguage("en")}
            aria-pressed={language === "en"}
          >🇬🇧 EN</button>
        </div>
        {onAbout && (
          <button type="button" onClick={onAbout} aria-label={text.about} title={text.about}>
            <Icon paths={circleInfoIcon} />
          </button>
        )}
      </nav>
    </header>
  );
}



export function LessonNavigationBar({ language, lesson, navigate, currentSection = "overview" }) {
  const text = COPY[language];
  const levelLessons = GROUP3_LESSONS
    .filter((item) => item.level === lesson.level)
    .sort((first, second) => Number(first.number) - Number(second.number));
  const activeLessonIndex = Math.max(0, levelLessons.findIndex((item) => item.slug === lesson.slug || item.id === lesson.id));
  const previousLesson = levelLessons[activeLessonIndex - 1];
  const nextLesson = levelLessons[activeLessonIndex + 1];
  const lessonIndexRef = useRef(null);

  useEffect(() => {
    const el = lessonIndexRef.current;
    const activeButton = el?.children[activeLessonIndex];
    if (!el || !activeButton) return;
    const frame = window.requestAnimationFrame(() => {
      const centeredLeft = activeButton.offsetLeft - ((el.clientWidth - activeButton.offsetWidth) / 2);
      el.scrollTo({ behavior: "smooth", left: Math.max(0, centeredLeft) });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [activeLessonIndex]);

  const selectLesson = (targetLesson) => {
    const targetSection = currentSection === "reader" ? "overview" : currentSection;
    navigate(lessonPath(targetLesson, targetSection));
  };

  return (
    <div className="g3-lesson-navigation" aria-label={language === "th" ? "เลือกบทเรียน" : language === "zh" ? "选择课文" : "Choose lesson"}>
      <button
        type="button"
        className="g3-lesson-step"
        aria-label={previousLesson ? `${text.lessonLabel} ${previousLesson.number}` : text.lessonLabel}
        disabled={!previousLesson}
        onClick={() => previousLesson && selectLesson(previousLesson)}
      >
        <span aria-hidden="true">←</span>
      </button>
      <nav ref={lessonIndexRef} className="g3-lesson-index">
        {levelLessons.map((item) => {
          const isActive = item.slug === lesson.slug || item.id === lesson.id;
          const title = { th: item.title?.thAid, zh: item.title?.zh, en: item.title?.en }[language] || item.title?.zh;
          return (
            <button
              type="button"
              className={isActive ? "is-active" : ""}
              aria-current={isActive ? "true" : undefined}
              key={item.id}
              onClick={() => selectLesson(item)}
            >
              <span>{String(item.number).padStart(2, "0")}</span>
              <small>{text.lessonLabel} {item.number}</small>
              <strong title={title}>{title}</strong>
            </button>
          );
        })}
      </nav>
      <button
        type="button"
        className="g3-lesson-step"
        aria-label={nextLesson ? `${text.lessonLabel} ${nextLesson.number}` : text.lessonLabel}
        disabled={!nextLesson}
        onClick={() => nextLesson && selectLesson(nextLesson)}
      >
        <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}

export function FrontMatterIndex({ current, language, navigate, lesson }) {
  const text = COPY[language];
  const labels = {
    preface: text.prefaceTitle,
    contents: text.contentsTitle,
    vocabulary: text.vocabularyTitle,
  };
  return (
    <nav className="g3-front-index" aria-label={text.frontMatterNavigation}>
      {frontMatterRoutes(lesson).map((item) => (
        <button className={current === item.name ? "is-current" : ""} type="button" key={item.name} onClick={() => navigate(item.path)} aria-current={current === item.name ? "page" : undefined}>
          <span>{item.number}</span>{labels[item.name]}
        </button>
      ))}
    </nav>
  );
}


export function BookPageControls({ language, navigate, backPath, backLabel, nextPath, nextLabel }) {
  const text = COPY[language];
  return (
    <footer className="g3-book-page-controls">
      <button type="button" onClick={() => navigate(backPath)}><i aria-hidden="true">←</i><span><small>{text.previousPage}</small>{backLabel}</span></button>
      <button className="is-next" type="button" onClick={() => navigate(nextPath)}><span><small>{text.nextPage}</small>{nextLabel}</span><i aria-hidden="true">→</i></button>
    </footer>
  );
}


export function StoryFooter({ language, lesson = null, route = null }) {
  const text = COPY[language];
  if (route?.name === "home" || !lesson) {
    return (
      <footer className="g3-footer">
        <span>读 · {text.routeLabels.home}</span>
        <p>{text.sourceOnly}</p>
        <small>新HSK教程 1–3 · New HSK Course 1–3 · 48 Lessons</small>
      </footer>
    );
  }
  const source = lesson.source || { title: "Loading...", lesson: "...", printedPages: "...", pdfPages: "..." };
  return (
    <footer className="g3-footer">
      <span>读 · {text.routeLabels.home}</span>
      <p>{text.sourceOnly}</p>
      <small>{source.title} · {source.lesson} · pp. {source.printedPages} · PDF {source.pdfPages}</small>
    </footer>
  );
}

export function AboutModal({ isOpen, onClose, language }) {
  const text = COPY[language];
  if (!isOpen) return null;
  return (
    <div className="g3-about-modal-backdrop" onClick={onClose}>
      <div className="g3-about-modal" onClick={(e) => e.stopPropagation()}>
        <header className="g3-about-modal-header">
          <h2>{text.footerMembersTitle}</h2>
          <button className="g3-about-modal-close" type="button" onClick={onClose} aria-label={text.aboutClose}>×</button>
        </header>
        <div className="g3-about-modal-body">
          <p className="g3-about-title">{text.footerTitle}</p>
          <p className="g3-about-desc">{text.footerGroupInfo}</p>
          <div className="g3-about-members-list">
            <span>{text.footerMember1}</span>
            <span>{text.footerMember2}</span>
            <span>{text.footerMember3}</span>
          </div>
          <small className="g3-about-course">{text.footerCourse}</small>
        </div>
      </div>
    </div>
  );
}
