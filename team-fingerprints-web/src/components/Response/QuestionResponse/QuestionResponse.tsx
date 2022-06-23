import classNames from "classnames";
import axios from "axios";

import { useState, useMemo, useEffect } from "react";
import { useMutation } from "react-query";
import { toNumber } from "lodash";
import { Progress } from "@mantine/core";

import useDefaultErrorHandler from "hooks/useDefaultErrorHandler";
import ModalConfirmTrigger from "components/Modals/ModalConfirmTrigger";

import { Answer, Question } from "types/models";
import { ReactComponent as RightArrow } from "assets/RightArrow.svg";
import { ReactComponent as LeftArrowGray } from "assets/LeftArrowGray.svg";

import "./styles.sass";

const OPTIONS = [
  { value: "1", label: "strongly disagree" },
  { value: "2", label: "disagree" },
  { value: "3", label: "neutral" },
  { value: "4", label: "agree" },
  { value: "5", label: "strongly agree" },
];

type QuestionWithAnswer = {
  question: Question;
  answer: Answer;
};

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
  surveyTitle?: string;
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

  const dotPosition = (value: number) => {
    const x = value - 1;
    const result = (x / (OPTIONS.length - 1)) * 100;

    return result;
  };

  const changeQuestion = (value: number) => {
    setQuestionIndex(value);
    setLiveValue(questionsWithAnswers[value].answer?.value);
  };

  useEffect(() => {
    const indexOfFirstQuestionWithoutAnswer = questionsWithAnswers?.findIndex(
      (item) => !item.answer || !item.answer.value
    );

    if (indexOfFirstQuestionWithoutAnswer > -1) {
      changeQuestion(indexOfFirstQuestionWithoutAnswer);
    } else {
      changeQuestion(numberOfQuestions - 1);
    }
  }, []);

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
    setLiveValue(toNumber(val));
    responseMutation.mutate({
      questionId: currentQuestion.question._id,
      value: toNumber(val),
    });
  };

  const previousButton = () => {
    return (
      <button
        className="response__button --previous"
        onClick={() => {
          changeQuestion(questionIndex - 1);
        }}
      >
        <LeftArrowGray className="left-arrow" /> Previous
      </button>
    );
  };

  const nextButton = () => {
    return (
      <button
        className="response__button --next"
        onClick={() => {
          changeQuestion(questionIndex + 1);
        }}
      >
        Next <RightArrow className="right-arrow" />
      </button>
    );
  };

  const submitButton = () => {
    return (
      <ModalConfirmTrigger
        modalMessage="Are you sure you want to finish this survey?"
        onConfirm={() => {
          finishSurvey();
        }}
        renderTrigger={(setModalVisible) => (
          <button
            onClick={() => {
              setModalVisible(true);
            }}
            disabled={disabled}
            className="response__button--submit"
          >
            Submit responses
          </button>
        )}
      />
    );
  };

  const nextStep = () => {
    return questionIndex + 1 < numberOfQuestions
      ? nextButton()
      : submitButton();
  };

  return (
    <div className="response">
      <div className="response__header">
        <h4 className="response__name">{surveyTitle}</h4>
        <h4 className="response__index">
          {questionIndex + 1}/{numberOfQuestions}
        </h4>
      </div>
      <Progress
        size="sm"
        value={progress}
        color="#32A89C"
        style={{ backgroundColor: "#292929" }}
      />
      <h3 className="response__title">{currentQuestion.question.title}</h3>
      <div className="response__answers">
        {OPTIONS.map((option) => (
          <label
            className={`response__wrapper offset-${dotPosition(
              toNumber(option.value)
            )}`}
            htmlFor={option.value}
          >
            <span className="response__label">{option.label}</span>
            <div
              className={classNames("response__input", {
                "--checked": toNumber(option.value) == liveValue,
              })}
            ></div>
            <input
              style={{ display: "none" }}
              name="input"
              value={option.value}
              id={option.value}
              type="checkbox"
              onChange={() => {
                toNumber(option.value) == liveValue
                  ? setAndSaveNewValue("")
                  : setAndSaveNewValue(option.value);
              }}
            ></input>
          </label>
        ))}
        {liveValue && (
          <div
            className={`response--checked offset-${dotPosition(liveValue)}`}
            onClick={() => {
              setAndSaveNewValue("");
            }}
          ></div>
        )}
      </div>
      <div className="response__nav">
        <div>{questionIndex > 0 && previousButton()}</div>
        <div>{liveValue && nextStep()}</div>
      </div>
    </div>
  );
}
