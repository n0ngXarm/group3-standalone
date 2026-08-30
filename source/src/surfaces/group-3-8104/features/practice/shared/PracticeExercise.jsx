import { FreeSpeakingExercise } from "../free-speaking/FreeSpeakingExercise.jsx";
import { RepeatSentenceExercise } from "../repeat/RepeatSentenceExercise.jsx";
import "./practice-exercise.css";

export function PracticeExercise(props) {
  if (props.exerciseType === "repeat-sentence") return <RepeatSentenceExercise {...props} />;
  return <FreeSpeakingExercise {...props} />;
}
