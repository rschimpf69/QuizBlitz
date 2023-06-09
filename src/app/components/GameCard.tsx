"use client";
import { useCallback, useState } from "react";

import AnswerComponent from "./AnswerComponent";
import Timer from "./Timer";
import QuestionAndAnswers from "./QuestionAndAnswers";
import { Answer, Question } from "@prisma/client";
import { time } from "console";

interface Props {
  questions: (Question & { answers: Answer[] })[];
}
interface AnsweredQuestion {
  question: string;
  selectedAnswer: string;
  correct: boolean;
  correctAnswer?: string;
}

const GameCard: React.FC<Props> = ({ questions }) => {
  //React States
  //Current question
  const [questionCounter, setQuestionCounter] = useState(0);
  //GameOver
  const [finished, setFinished] = useState(false);
  //Array of Answered questions by player
  const [AnsweredQuestions, setAnsweredQuestions] = useState(
    Array(questions.length).fill(null)
  );
  //Question currently displayed
  const question = questions[questionCounter];

  //Function ejectued when player selects an answer
  const changeQuestion = (index: number) => {
    //Add Answer to the Answer Array
    const answeredQuestion: AnsweredQuestion = {
      question: question.question,
      selectedAnswer: question.answers[index].answer,
      correct: question.answers[index].correct,
      correctAnswer: question.answers.find((answer) => answer.correct)?.answer,
    };
    //Copy of the original Array.
    const newAnsweredQuestion = [...AnsweredQuestions];
    newAnsweredQuestion[questionCounter] = answeredQuestion;
    setAnsweredQuestions(newAnsweredQuestion);

    if (questionCounter == questions.length - 1) {
      //NO question more questions? -> Finish game
      setFinished(true);
    } else {
      // Go to the next Question
      setQuestionCounter((questionCounter) => questionCounter + 1);
    }
  };
  const gameOver = () => {
    setFinished(true);
  };

  return (
    <>
      {!finished ? (
        <div className="flex min-h-screen w-4/12 flex-col  bg-white px-10">
          <div className="mb-5 flex h-1/4 w-full justify-center items-center mt-5">
            <div className="h-auto w-full border-lime-100 bg-red-200 flex justify-center text-6xl text-white">
              <Timer gameOver={gameOver} time={30} />
            </div>
          </div>
          <div className="w-full h-auto flex-col justify-center items-center mt-20 ">
            <QuestionAndAnswers
              question={question.question}
              answers={question.answers}
              onAnswer={changeQuestion}
            />
          </div>
        </div>
      ) : (
        <main>
          {/* {AnsweredQuestions.map((answer: AnsweredQuestion, index: number) => {
            return (
              <h1>
                {index +
                  " - " +
                  answer.question +
                  " - " +
                  (answer.selectedAnswer == answer.correctAnswer
                    ? answer.selectedAnswer
                    : answer.selectedAnswer + " - " + answer.correctAnswer) +
                  " - "}
              </h1>
            );
          })} */}
        </main>
      )}
    </>
  );
};
export default GameCard;
