import Icon from "../../../../shared/components/ui/Icon.jsx";
import { volumeHighIcon } from "../../../../shared/components/ui/iconPaths.js";
import { COPY } from "../../content/copy.js";
import { speakChinese } from "../../services/audio/index.js";
import { lessonPath, scenePath } from "../../routing/routes.js";
import { BookPageControls, FrontMatterIndex, LessonNavigationBar, SourceStamp } from "../../shared/components/index.js";

export function PrefacePage({ language, lesson, navigate }) {
  const text = COPY[language];
  const source = lesson.source;
  return (
    <main className="g3-front-matter g3-preface-page">
      <LessonNavigationBar language={language} lesson={lesson} navigate={navigate} currentSection="overview" />
      <FrontMatterIndex current="preface" language={language} lesson={lesson} navigate={navigate} />
      <article className="g3-book-spread" data-source-ref={source.sourceRef}>
        <section className="g3-preface-lead">
          <span className="g3-book-corner">{text.lessonLabel} <b>{lesson.number}</b></span>
          <p className="g3-kicker">{text.frontMatterKicker}</p>
          <h1 tabIndex="-1">{text.prefaceTitle}</h1>
          <strong>{lesson.title.zh}</strong>
          <em>{lesson.title.pinyin}</em>
          <p>{{ th: lesson.summary.thAid, zh: lesson.summary.zh, en: lesson.summary.en }[language]}</p>
          <div className="g3-hero-actions" style={{ marginTop: "1rem", marginBottom: "1rem" }}>
            <button className="g3-primary-action" type="button" onClick={() => navigate(scenePath(lesson, 1))}>
              {language === "th" ? "เริ่มเรียนบทนี้ (ฉากที่ 1)" : language === "zh" ? "进入本课学习 (第1幕)" : "Start Lesson (Scene 1)"} <i aria-hidden="true">→</i>
            </button>
          </div>
          <small>{text.bookSourceNote} · {text.printedPage} {source.printedPages.split("–")[0]}</small>
          {language === "th" && <small className="g3-editorial-aid">{lesson.translationPolicy.labelTh}</small>}
        </section>
        <section className="g3-objective-page">
          <header><span>目标</span><div><p>{text.objectivesLabel}</p><h2>{text.objectiveTitle}</h2></div></header>
          <ol>
            {lesson.objectives.map((objective, index) => (
              <li key={objective.zh} data-source-ref={objective.sourceRef}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{objective.zh}</strong>
                  <p>{{ th: objective.thAid || objective.th, zh: objective.zh, en: objective.en || text.educationalUnavailable }[language]}</p>
                </div>
              </li>
            ))}
          </ol>
          <SourceStamp compact lesson={lesson} />
        </section>
      </article>
      {lesson.grammarFocus.length > 0 && (
        <section className="g3-grammar-ledger" aria-labelledby="g3-grammar-title">
          <div className="g3-section-heading"><p>{text.languageFocusLabel} · 语法</p><h2 id="g3-grammar-title">{language === "th" ? "ไวยากรณ์และโครงสร้างสำคัญในบทนี้" : language === "zh" ? "本课语言点" : "Language focus"}</h2></div>
          {lesson.grammarFocus.map((grammar, index) => (
            <article key={grammar.title} data-source-ref={grammar.sourceRef}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div><h3>{grammar.title}</h3><em>{grammar.titleEn}</em><p>{{ th: grammar.thAid, zh: grammar.explanationZh, en: grammar.explanationEn }[language]}</p><ul>{grammar.examples.map((example) => <li key={example}>{example}</li>)}</ul></div>
            </article>
          ))}
        </section>
      )}
      <BookPageControls language={language} navigate={navigate} backPath="/home/" backLabel={text.home} nextPath={lessonPath(lesson, "contents")} nextLabel={text.contentsTitle} />
    </main>
  );
}

export function ContentsPage({ language, lesson, navigate }) {
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
              ? scenePath(lesson, item.scene)
              : item.route ? lessonPath(lesson, "overview") : null;
            const content = <><span className="g3-toc-number">{item.number}</span><span className="g3-toc-copy"><strong>{title}</strong><small>{supportingTitle}</small></span><i aria-hidden="true" /><span className="g3-toc-page">{item.pages}</span></>;
            return targetPath
              ? <button type="button" key={item.number} onClick={() => navigate(targetPath)}>{content}</button>
              : <div key={item.number}>{content}</div>;
          })}
        </div>
        <p className="g3-page-source">{source.title} · {source.lesson} · {text.printedPage} {source.printedPages}</p>
      </article>
      <BookPageControls language={language} navigate={navigate} backPath={lessonPath(lesson, "preface")} backLabel={text.prefaceTitle} nextPath={lessonPath(lesson, "vocabulary")} nextLabel={text.vocabularyTitle} />
    </main>
  );
}

export function VocabularyPage({ language, lesson, navigate }) {
  const text = COPY[language];
  const pages = [...new Set(lesson.vocabulary.map((word) => word.page))].join(", ");
  return (
    <main className="g3-front-matter g3-vocabulary-page">
      <LessonNavigationBar language={language} lesson={lesson} navigate={navigate} currentSection="vocabulary" />
      <FrontMatterIndex current="vocabulary" language={language} lesson={lesson} navigate={navigate} />
      <article className="g3-book-spread is-single-page" data-source-ref={lesson.source.sourceRef}>
        <header className="g3-front-title">
          <div><p className="g3-kicker">{text.newWordsLabel} · {text.lessonLabel} {lesson.number}</p><h1 tabIndex="-1">{text.vocabularyTitle}</h1><span>{language === "th" ? `รวมคำศัพท์ ${lesson.vocabulary.length} คำ` : `${lesson.vocabulary.length} ${language === "zh" ? "个生词" : "words"}`} · pp. {pages}</span></div>
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
        <p className="g3-page-source">{text.bookSourceNote} · {text.printedPage} {pages}</p>
      </article>
      <BookPageControls language={language} navigate={navigate} backPath={lessonPath(lesson, "contents")} backLabel={text.contentsTitle} nextPath={scenePath(lesson, 1)} nextLabel={text.startReading} />
    </main>
  );
}
