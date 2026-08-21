import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import Group3GameHub from "../../src/surfaces/group-3-8104/features/games/hub/Group3GameHub.jsx";
import { LESSON_HSK1_L1 } from "../../src/surfaces/group-3-8104/content/lessons/hsk1/lesson-01/content.js";

function Harness() {
  const [activeGame, setActiveGame] = useState(null);
  useEffect(() => {
    window.__G3_TEST_API__ = { lesson: LESSON_HSK1_L1, setActiveGame };
    return () => { delete window.__G3_TEST_API__; };
  }, []);
  return (
    <Group3GameHub
      activeGame={activeGame}
      lesson={LESSON_HSK1_L1}
      language="th"
      onBack={() => {}}
      onSelectGame={setActiveGame}
      onShowHub={() => setActiveGame(null)}
    />
  );
}

createRoot(document.getElementById("root")).render(<Harness />);
