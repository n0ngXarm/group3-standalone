const fs = require('fs');
const content = fs.readFileSync('src/surfaces/group-3-8104/features/lessons/reader/ReadingTheatre.jsx', 'utf8');

// We want to replace the main return statement.
// The main return statement starts with:
//   return (
//     <main className={`g3-reader${roleplayActive ? " is-roleplay" : ""}`} data-status={playbackStatus}>
// We can locate it by searching for that exact string.

const searchString = '  return (\n    <main className={`g3-reader${roleplayActive ? " is-roleplay" : ""}`} data-status={playbackStatus}>';
const returnIndex = content.indexOf(searchString);

if (returnIndex === -1) {
  console.error("Could not find the start of the return statement");
  process.exit(1);
}

const beforeReturn = content.slice(0, returnIndex);

const newReturn = `  return (
    <main className={\`g3-reader-layout g3-level-\${lesson.level}\${roleplayActive ? " is-roleplay" : ""}\`} data-status={playbackStatus}>
      <div className="g3-reader-layout-inner">
        {/* LEFT: Sidebar Navigation */}
        <nav className="g3-reader-sidebar" aria-label={text.catalogTitle}>
          <h2>{language === "th" ? "สารบัญ" : language === "zh" ? "目录" : "Contents"}</h2>
          <button className="g3-reader-back" type="button" onClick={() => navigate(lessonContentsPath(lesson))} aria-label={text.exitReader}>
            <span aria-hidden="true">←</span> {language === "th" ? "กลับหน้าเลือกตอน" : "Back"}
          </button>
          
          <ul className="g3-reader-nav-list">
            {scenes.map((item, index) => {
              const isActive = sceneIndex === index;
              return (
                <li key={item.id}>
                  <button 
                    type="button" 
                    className={\`g3-reader-nav-item \${isActive ? 'is-active' : ''}\`} 
                    onClick={() => selectScene(index)}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span>{text.sceneLabel || "Scene"} {item.number}</span>
                    <strong>{sceneTitle(item, language)}</strong>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* CENTER: Hero Image */}
        <section className="g3-reader-hero">
          {!lowData && scene.image && (
             <img src={scene.image} srcSet={scene.imageSrcSet} alt={scene.imageAlt?.[language] || ""} loading="lazy" decoding="async" />
          )}
          <div className="g3-reader-hero-overlay">
             <span>{text.sceneLabel || "Scene"} {scene.number}</span>
             <h2>{scene.title}</h2>
          </div>
        </section>

        {/* RIGHT: Content Area */}
        <section className="g3-reader-content">
          {playbackStatus === "briefing" ? (
            <div className="g3-reader-intro">
              <h1>{sceneTitle(scene, language)}</h1>
              <h2>{sceneSupportingTitle(scene, language)}</h2>
              <p>{sceneContext(scene, language)}</p>
              
              <div className="g3-intro-characters">
                <h3>{text.roleMap || "Characters"}</h3>
                {sortedCharacters.map((character) => {
                  const profile = characterProfiles[character.profile];
                  return (
                    <div key={character.role} className="g3-intro-character">
                      {!lowData && profile && <img src={profile.image} alt="" />}
                      <div>
                        <strong>{character.role}: {profileName(profile, language)}</strong>
                        <small>{supportingProfileName(profile, language)}</small>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="g3-intro-actions">
                <button className="g3-intro-btn-primary" type="button" onClick={() => beginReading("autoplay")}>
                  {text.autoplayBegin || "Start Dialogue"} <span aria-hidden="true">→</span>
                </button>
                <button className="g3-intro-btn-secondary" type="button" onClick={() => beginReading("manual")}>
                  {text.manualBegin || "Read Manually"}
                </button>
              </div>
            </div>
          ) : (
            <div className="g3-reader-dialogue-wrapper">
              <header className="g3-reader-dialogue-header">
                <button type="button" onClick={() => setShowTranslation((v) => !v)} className={showTranslation ? "is-on" : ""}>
                  <Icon paths={languageIcon} /> {showTranslation ? text.translationOn : text.translationOff}
                </button>
                <button type="button" onClick={() => setTimed((v) => !v)} className={timed ? "is-on" : ""}>
                  <Icon paths={stopwatchIcon} /> {timed ? text.timerOn : text.timerOff}
                </button>
              </header>

              <div className="g3-dialogue-stage">
                {visibleLines.map((line, index) => {
                  const character = scene.characters.find((item) => item.role === line.role);
                  const voiceProfile = line.voiceProfiles?.[0] || character?.profile || "wang";
                  const profile = character ? characterProfiles[character.profile] : characterProfiles[voiceProfile];
                  const voice = GROUP3_VOICE_PROFILES[voiceProfile];
                  const isLeft = line.role === leftRole;
                  return (
                    <article
                      aria-current={index === lineIndex ? "step" : undefined}
                      aria-live={index === lineIndex ? "polite" : undefined}
                      key={\`\${scene.id}-\${index}\`}
                      ref={(node) => { lineRefs.current[index] = node; }}
                      className={\`g3-dialogue-line \${isLeft ? "is-left" : "is-right"} role-\${line.role.toLowerCase()}\${index === lineIndex ? " is-current" : ""}\`}
                    >
                      <div className="g3-speaker-mark">
                        {profile && !lowData && <img src={profile.image} srcSet={profile.imageSrcSet} alt="" width="640" height="640" loading="lazy" decoding="async" style={{ objectPosition: profile.imageFocus }} />}
                        <span>{line.role}</span>
                        <strong>{profile ? profileName(profile, language) : line.speaker}</strong>
                        <small>{profile ? supportingProfileName(profile, language) : line.speaker}</small>
                      </div>
                      <div className="g3-line-copy">
                        <button type="button" onClick={() => {
                          queueManualPlayback(index, voiceProfile);
                        }} aria-label={\`\${text.speak}: \${line.hanzi} · \${voice?.label || "TTS"}\`} title={\`\${text.voiceCast} · \${voice?.label || "TTS"}\`}><Icon paths={volumeHighIcon} /></button>
                        <strong>{line.hanzi}</strong><em>{line.reading}</em>
                        {showTranslation && <div className="g3-line-translation"><span>{text.thaiMeaning}</span><p>{line.th}</p></div>}
                      </div>
                    </article>
                  );
                })}
              </div>

              {completed && (
                <section className="g3-reader-completion" aria-live="polite">
                  <div className="g3-reader-completion-icon">✓</div>
                  <h2>{language === "th" ? \`จบตอนที่ \${sceneIndex + 1}\` : \`End of Scene \${sceneIndex + 1}\`}</h2>
                  <p>{language === "th" ? "คุณเรียนบทสนทนาในตอนนี้เสร็จแล้ว" : "You have completed this dialogue"}</p>
                  
                  <div className="g3-reader-completion-actions">
                    {sceneIndex < scenes.length - 1 ? (
                      <>
                        <button className="is-primary" type="button" onClick={() => selectScene(sceneIndex + 1)}>
                          {language === "th" ? \`เริ่มตอนที่ \${sceneIndex + 2} →\` : \`Start Scene \${sceneIndex + 2} →\`}
                        </button>
                        <button className="is-secondary" type="button" onClick={() => navigate(lessonContentsPath(lesson))}>
                          {language === "th" ? "กลับไปเลือกตอน" : "Back to Contents"}
                        </button>
                      </>
                    ) : (
                      <button className="is-primary" type="button" onClick={() => navigate(lessonContentsPath(lesson))}>
                        {language === "th" ? "กลับไปหน้าเลือกบทเรียน" : "Back to Lessons"}
                      </button>
                    )}
                  </div>
                </section>
              )}
            </div>
          )}
        </section>
      </div>

      {currentLine && !completed && (
        <StoryPlaybackDock
          canNext={!challenge}
          canPrevious={lineIndex > 0 && !challenge}
          controlsDisabled={Boolean(challenge)}
          detailsOpen={detailsOpen}
          lineIndex={lineIndex}
          markers={playbackMarkers}
          onNext={nextLine}
          onPrevious={previousLine}
          onReplay={replayCurrentLine}
          onSpeedChange={setPlaybackSpeed}
          onToggleDetails={() => setDetailsOpen((value) => !value)}
          onTogglePlayback={togglePlayback}
          onToggleSound={toggleSound}
          soundBlocked={soundBlocked}
          soundEnabled={soundEnabled}
          speaker={currentSpeaker}
          speed={playbackSpeed}
          speedOptions={GROUP3_PLAYBACK_CONFIG.speedOptions}
          status={challenge ? "challenge" : soundBlocked ? "blocked" : playbackStatus}
          text={text}
          totalLines={scene.lines.length}
          upcomingCue={upcomingCue}
        />
      )}

      {challenge?.type === "qte" && (
        <QteChallenge
          challenge={challenge.data}
          language={language}
          timed={timed}
          onResolve={resolveChallenge}
          onRestart={roleplayRole ? restartRoleplay : undefined}
          sourceLine={currentLine}
        />
      )}
      {challenge?.type === "builder" && <SentenceChallenge challenge={challenge.data} language={language} level={lesson.level} onResolve={resolveChallenge} onRestart={restartScene} sourceLine={currentLine} />}

      {roleplayActive && createPortal(
        <Suspense fallback={null}>
          <RoleplayView
            characters={characterProfiles}
            language={language}
            lineIndex={lineIndex}
            lines={scene.lines}
            onExit={exitRoleplay}
            onTogglePlayback={togglePlayback}
            role={roleplayRole}
            scene={scene}
            status={roleplayStatus}
            text={text}
          />
        </Suspense>,
        document.body
      )}

    </main>
  );
}
`;

fs.writeFileSync('src/surfaces/group-3-8104/features/lessons/reader/ReadingTheatre.jsx', beforeReturn + newReturn);
console.log("Successfully replaced the JSX block");
