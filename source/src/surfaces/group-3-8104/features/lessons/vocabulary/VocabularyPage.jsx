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


export function VocabularyPage({ language, lesson, navigate }) {
  const text = COPY[language];
  return (
    <main className="g3-front-matter g3-vocabulary-page">
      <LessonNavigationBar language={language} lesson={lesson} navigate={navigate} currentSection="vocabulary" />
      <FrontMatterIndex current="vocabulary" language={language} lesson={lesson} navigate={navigate} />
      <article className="g3-book-spread is-single-page" data-source-ref={lesson.source.sourceRef}>
        <header className="g3-front-title">
          <div><p className="g3-kicker">{text.newWordsLabel} · {text.lessonLabel} {lesson.number}</p><h1 tabIndex="-1">{text.vocabularyTitle}</h1><span>{language === "th" ? `รวมคำศัพท์ ${lesson.vocabulary.length} คำ` : `${lesson.vocabulary.length} ${language === "zh" ? "个生词" : "words"}`}</span></div>
          <b>{text.vocabularyLabel}</b>
        </header>
        <div className="g3-vocabulary-ledger">
          {lesson.vocabulary.map((word) => (
            <button type="button" key={word.index} data-source-ref={word.sourceRef} onClick={() => speakChinese(word.hanzi)} aria-label={`${text.speak}: ${word.hanzi}`}>
              <span className="g3-vocab-index">{String(word.index).padStart(2, "0")}</span>
              <span className="g3-vocab-word"><strong>{word.hanzi}</strong><em>{word.pinyin}</em></span>
              <span className="g3-vocab-meaning">
                <small>{word.type} · {word.en}</small>
                <b>{word.thAid || word.th}</b>
              </span>
              <span className="g3-vocab-page">p. {word.page}</span>
              <Icon paths={volumeHighIcon} />
            </button>
          ))}
        </div>
      </article>
      <BookPageControls
        language={language}
        navigate={navigate}
        backPath={lessonContentsPath(lesson)}
        backLabel={text.contentsTitle}
        nextPath={lessonScenePath(lesson, 1)}
        nextLabel={text.startReading}
      />
    </main>
  );
}
