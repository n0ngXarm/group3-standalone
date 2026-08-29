import { FreeSpeakingExercise } from "./FreeSpeakingExercise.jsx";
import { RepeatSentenceExercise } from "./RepeatSentenceExercise.jsx";
import "./practice-exercise.css";

export function PracticeExercise(props) {
  if (props.exerciseType === "repeat-sentence") return <RepeatSentenceExercise {...props} />;
  return <FreeSpeakingExercise {...props} />;
}
