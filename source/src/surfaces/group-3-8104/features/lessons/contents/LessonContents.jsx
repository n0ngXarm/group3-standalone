import Icon from "../../../../../shared/components/ui/Icon.jsx";
import { volumeHighIcon } from "../../../../../shared/components/ui/iconPaths.js";
import { COPY } from "../../../content/copy.js";
import { speakChinese } from "../../../services/audio/index.js";
import {
  levelPath,
  lessonContentsPath,
  lessonVocabularyPath,
  lessonScenePath,
} from "../../../routing/routes.js";
import { BookPageControls, FrontMatterIndex, LessonNavigationBar } from "../../../shared/components/index.js";


export function LessonContents({ language, lesson, navigate }) {
  const text = COPY[language];
  const source = lesson.source;
  return (
    <main className="g3-front-matter g3-contents-page">
      <LessonNavigationBar language={language} lesson={lesson} navigate={navigate} currentSection="contents" />
      <FrontMatterIndex current="contents" language={language} lesson={lesson} navigate={navigate} />
      <article className="g3-book-spread is-single-page" data-source-ref={source.sourceRef}>
        <header className="g3-front-title">
          <div><p className="g3-kicker">{text.lessonLabel} {lesson.number} · {text.frontMatterKicker}</p><h1 tabIndex="-1">{text.contentsTitle}</h1><span>{text.contentsBody}</span></div>
          <b>{text.contentsLabel}</b>
        </header>
        <div className="g3-toc-lines">
          {lesson.contents.map((item) => {
            const title = { th: item.titleTh, zh: item.title, en: item.detail }[language];
            const supportingTitle = {
              th: `${item.title} · ${item.detail}`,
              zh: item.detail,
              en: item.title,
            }[language];
            const targetPath = item.scene
              ? lessonScenePath(lesson, item.scene)
              : null;
            const content = <><span className="g3-toc-number">{item.number}</span><span className="g3-toc-copy"><strong>{title}</strong><small>{supportingTitle}</small></span><i aria-hidden="true" /><span className="g3-toc-page">{item.pages}</span></>;
            return targetPath
              ? <button type="button" key={item.number} onClick={() => navigate(targetPath)}>{content}</button>
              : <div key={item.number}>{content}</div>;
          })}
        </div>
      </article>
      <BookPageControls
        language={language}
        navigate={navigate}
        backPath={levelPath(lesson.level)}
        backLabel={text.shelfTitle || text.catalogTitle || text.back}
        nextPath={lessonVocabularyPath(lesson)}
        nextLabel={text.vocabularyTitle}
      />
    </main>
  );
}
