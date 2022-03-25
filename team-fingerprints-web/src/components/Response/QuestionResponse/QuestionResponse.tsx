import { useState, useMemo } from "react";
import classNames from "classnames";
import { useMutation } from "react-query";
import { toNumber } from "lodash";
import axios from "axios";
import { Progress } from "@mantine/core";

import { Answer, Question } from "../../../types/models";
import { ReactComponent as RightArrow } from "../../../assets/RightArrow.svg";
import { ReactComponent as LeftArrowGray } from "../../../assets/LeftArrowGray.svg";
import useDefaultErrorHandler from "../../../hooks/useDefaultErrorHandler";

import "./styles.sass";

const OPTIONS = [
  { value: "1", label: "strongly disagree" },
  { value: "2", label: "disagree" },
  { value: "3", label: "neutral" },
  { value: "4", label: "agree" },
  { value: "5", label: "strongly agree" },
];

type QuestionWithAnswer = { question: Question; answer: any };

export default function QuestionResponse({
  refetch,
  questionsWithAnswers,
  disabled,
  surveyId,
  finishSurvey,
  surveyTitle,
}: {
  refetch: () => void;
  questionsWithAnswers: QuestionWithAnswer[];
  disabled: boolean;
  surveyId: string;
  finishSurvey: () => void;
  surveyTitle: string | undefined;
}) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const currentQuestion = questionsWithAnswers[questionIndex];
  const numberOfQuestions = questionsWithAnswers.length;
  const [liveValue, setLiveValue] = useState(currentQuestion.answer?.value);

  const progress = useMemo(() => {
    const x = questionIndex + 1;
    const result = (x / numberOfQuestions) * 100;

    return result;
  }, [questionIndex, numberOfQuestions]);

  const dotPosition = (value: any) => {
    const x = value - 1;
    const result = (x / 4) * 100 + "%";

    return result;
  };

  const changeQuestion = (value: number) => {
    setQuestionIndex(value);
    setLiveValue(questionsWithAnswers[value].answer?.value);
  };

  const { onErrorWithTitle } = useDefaultErrorHandler();

  const responseMutation = useMutation(
    async (surveyResponse: Answer) => {
      return axios.post(`/survey-answers/${surveyId}`, surveyResponse);
    },
    {
      onSuccess: () => {
        refetch();
      },
      onError: onErrorWithTitle("Can not save answer"),
    }
  );

  const setAndSaveNewValue = (val: string) => {
    setLiveValue(val);
    responseMutation.mutate({
      questionId: currentQuestion.question._id,
      value: toNumber(val),
    });
  };

  const previousButton = () => {
    return (
      <button
        className="survey-response__survey__nav__button"
        onClick={() => {
          changeQuestion(questionIndex - 1);
        }}
      >
        <LeftArrowGray /> Previous
      </button>
    );
  };

  const nextButton = () => {
    return (
      <button
        className="survey-response__survey__nav__button --next"
        onClick={() => {
          changeQuestion(questionIndex + 1);
        }}
      >
        Next <RightArrow />
      </button>
    );
  };

  const submitButton = () => {
    return (
      <button
        onClick={() => finishSurvey()}
        disabled={disabled}
        className="survey-response__survey__nav__button--submit"
      >
        Submit responses
      </button>
    );
  };

  const nextStep = () => {
    return questionIndex + 1 < numberOfQuestions
      ? nextButton()
      : submitButton();
  };

  return (
    <div className="survey-response__survey">
      <div className="survey-response__survey__header">
        <h4 className="survey-response__survey__name">{surveyTitle}</h4>
        <h4 className="survey-response__survey__index">
          {questionIndex + 1}/{numberOfQuestions}
        </h4>
      </div>
      <Progress size="sm" value={progress} color="#32A89C" />
      <h3 className="survey-response__survey__title">
        {currentQuestion.question.title}
      </h3>
      <div className="survey-response__survey__answers">
        {OPTIONS.map((option) => (
          <label
            className="survey-response__survey__answers__wrapper"
            htmlFor={option.value}
            style={{ left: dotPosition(option.value) }}
          >
            <span className="survey-response__survey__answers__label">
              {option.label}
            </span>
            <div
              className={classNames("survey-response__survey__answers__input", {
                "--checked": option.value == liveValue,
              })}
            ></div>
            <input
              style={{ display: "none" }}
              name="input"
              value={option.value}
              id={option.value}
              type="checkbox"
              onChange={() => {
                option.value == liveValue
                  ? setAndSaveNewValue("")
                  : setAndSaveNewValue(option.value);
              }}
            ></input>
          </label>
        ))}
        {liveValue && (
          <div
            className="survey-response__survey__answers--checked"
            onClick={() => {
              setLiveValue("");
            }}
            style={{ left: dotPosition(liveValue) }}
          ></div>
        )}
      </div>
      <div className="survey-response__survey__nav">
        <div>{questionIndex > 0 && previousButton()}</div>
        <div>{liveValue && nextStep()}</div>
      </div>
    </div>
  );
}
