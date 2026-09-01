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
import { GROUP3_LESSONS } from "../../content/registry.js";
import { frontMatterRoutes, lessonVocabularyPath } from "../../routing/routes.js";
import { surfaceAssetPath } from "../../../../shared/lib/surface-url.js";
import { getLearnerSession } from "../../shared/session.js";
import { homeLogoMedia, mapHomeMedia } from "../../features/home/homeMedia.js";





export function LessonNavigationBar({ language, lesson, navigate}) {
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
    navigate(lessonVocabularyPath(targetLesson));
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
        
      </footer>
    );
  }
  return (
    <footer className="g3-footer">
      <span>读 · {text.routeLabels.home}</span>
      <p>{text.sourceOnly}</p>
      
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
