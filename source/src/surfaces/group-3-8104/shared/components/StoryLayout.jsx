import { useEffect, useRef } from "react";
import Icon from "../../../../shared/components/ui/Icon.jsx";
import {
  circleInfoIcon,
  moonIcon,
  sunIcon,
} from "../../../../shared/components/ui/iconPaths.js";
import { COPY } from "../../content/copy.js";
import { FEATURED_LESSON, GROUP3_LESSONS } from "../../content/registry.js";
import { frontMatterRoutes, lessonPath } from "../../routing/routes.js";
import { surfaceAssetPath } from "../../../../shared/lib/surface-url.js";

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


export { GuideButton, GuideModal } from "./GuideModal.jsx";

export function StoryHeader({ route, lesson, theme, language, onTheme, onLanguage, onHome, onAbout, onGuide }) {
  const text = COPY[language];
  const routeLabel = route.name === "reader"
    ? `${text.stage} 0${route.scene + 1}`
    : text.routeLabels[route.name] || text.routeLabels.home;
  return (
    <header className="g3-header">
      <div className="group-title-dropdown-wrap">
        <button
          aria-label={text.routeLabels.home}
          className="g3-brand"
          onClick={onHome}
          type="button"
        >
          <span aria-hidden="true">读</span>
          <span>
            <strong>{text.brand}</strong>
            <small>{text.group}</small>
          </span>
        </button>
      </div>

      <div className="g3-route-mark" aria-hidden="true">
        <span>{routeLabel}</span>
      </div>
      <SourceStamp compact lesson={lesson} route={route} />
      <nav className="g3-header-actions" aria-label={text.navigation}>
        {onGuide && (
          <button
            type="button"
            className="g3-header-guide-btn"
            onClick={onGuide}
            aria-label={text.howToPlay}
            title={text.howToPlay}
          >
            <span aria-hidden="true">💡</span>
            <span className="g3-header-guide-text">{text.guide}</span>
          </button>
        )}
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


export function MarketIllustration({ language, lowData = false }) {
  const text = COPY[language];
  const dialogueLines = {
    th: [
      ["g3-dialogue-label", "พนักงานขายถาม"],
      ["g3-dialogue-main", "คุณต้องการซื้ออะไร?"],
      ["g3-dialogue-sub", "您想买什么？ (Nín xiǎng mǎi shénme?)"],
    ],
    zh: [
      ["g3-dialogue-label", "售货员问"],
      ["g3-dialogue-main", "您想买什么？"],
      ["g3-dialogue-sub", "Nín xiǎng mǎi shénme?"],
    ],
    en: [
      ["g3-dialogue-label", "Seller asks"],
      ["g3-dialogue-main", "What would you like to buy?"],
      ["g3-dialogue-sub", "您想买什么？ (Nín xiǎng mǎi shénme?)"],
    ],
  }[language];
  return (
    <div className="g3-market-art g3-anime-hero-art" aria-hidden="true" data-low-data={lowData}>
      {!lowData && (
        <div className="g3-character-stage">
          <img className="g3-market-insert" src={surfaceAssetPath(3, "/assets/group3/shared/backgrounds/hero-market-stage-v1.webp")} alt="" width="1536" height="1024" decoding="async" loading="eager" fetchPriority="high" />
          <div className="g3-stage-actor is-seller">
            <img className="g3-actor-frame is-idle" src={surfaceAssetPath(3, "/assets/group3/shared/characters/hero-seller-idle-v1.webp")} alt="" width="768" height="1024" decoding="async" loading="eager" />
            <img className="g3-actor-frame is-action" src={surfaceAssetPath(3, "/assets/group3/shared/characters/hero-seller-gesture-v2.webp")} alt="" width="768" height="1024" decoding="async" loading="eager" />
          </div>
          <div className="g3-stage-actor is-student-male">
            <img className="g3-actor-frame is-idle" src={surfaceAssetPath(3, "/assets/group3/shared/characters/hero-student-male-idle-v1.webp")} alt="" width="768" height="1024" decoding="async" loading="eager" />
            <img className="g3-actor-frame is-action" src={surfaceAssetPath(3, "/assets/group3/shared/characters/hero-student-male-talk-v2.webp")} alt="" width="768" height="1024" decoding="async" loading="eager" />
          </div>
          <div className="g3-stage-actor is-student-female">
            <img className="g3-actor-frame is-idle" src={surfaceAssetPath(3, "/assets/group3/shared/characters/hero-student-female-idle-v1.webp")} alt="" width="768" height="1024" decoding="async" loading="eager" />
            <img className="g3-actor-frame is-action" src={surfaceAssetPath(3, "/assets/group3/shared/characters/hero-student-female-talk-v2.webp")} alt="" width="768" height="1024" decoding="async" loading="eager" />
          </div>
        </div>
      )}
      <div className="g3-market-image-shade" />
      <div className="g3-anime-scene-mark">
        <b>03</b>
        <span><small>{text.marketLabel}</small><strong>{text.marketStartLine1} {text.marketStartLine2}</strong></span>
      </div>
      <div className="g3-anime-dialogue" key={language}>
        {dialogueLines.map(([className, line], index) => (
          <span className={className} style={{ "--g3-line-index": index }} key={className}>{line}</span>
        ))}
      </div>
    </div>
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
