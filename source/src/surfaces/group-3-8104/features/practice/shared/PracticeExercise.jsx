import { FreeSpeakingExercise } from "../free-speaking/FreeSpeakingExercise.jsx";
import { QuestionResponseExercise } from "../question-response/QuestionResponseExercise.jsx";
import { RepeatSentenceExercise } from "../repeat/RepeatSentenceExercise.jsx";
import "./practice-exercise.css";

export function PracticeExercise(props) {
  if (props.exerciseType === "repeat-sentence") return <RepeatSentenceExercise {...props} />;
  if (props.exerciseType === "question-response") return <QuestionResponseExercise {...props} />;
  return <FreeSpeakingExercise {...props} />;
}
