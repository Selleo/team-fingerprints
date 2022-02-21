import React, { useMemo, useState } from "react";

import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import { find, flatMapDeep, size, toNumber } from "lodash";
import { Button, Center, Group, SegmentedControl } from "@mantine/core";
import axios from "axios";

import { shuffle } from "./utils";

import { SurveyDetails } from "../../../types/models";

import Chart from "../../../components/Chart";
import QuestionResponse from "../../../components/Response/QuestionResponse/QuestionResponse";

export default function Edit() {
  const [mode, setMode] = useState("result");
  const { surveyId } = useParams();
  const {
    isLoading: isLoadingSurvey,
    error: errorLoadingSurvey,
    data: survey,
  } = useQuery<SurveyDetails, Error>(
    `surveyOne${surveyId}`,
    async () => {
      const { data } = await axios.get<SurveyDetails>(
        `/surveys/${surveyId}`
      );
      return data;
    }
  );

  const {
    isLoading: isLoadingSurveyFinished,
    data: surveyFinished,
    refetch: refetchIsFinished,
  } = useQuery<any, Error>(`surveyFinishedOne-${surveyId}`, async () => {
    const { data } = await axios.get<any>(`/survey-answers/${surveyId}`);
    return data;
  });

  const finishSurvey = useMutation(
    async () => {
      return axios.post(`/survey-answers/${surveyId}/finish`);
    },
    {
      onSuccess: () => refetchIsFinished(),
    }
  );
  const surveyIsFinished =
    surveyFinished?.surveysAnswers?.[0].completeStatus === "finished";

  const {
    isLoading: isLoadingSurveyResponse,
    error: errorLoadingSurveyResponse,
    data: surveyResponse,
    refetch,
  } = useQuery<any, Error>(`surveyResponseOne-${surveyId}`, async () => {
    const { data } = await axios.get<any>(`/survey-answers/${surveyId}`);
    return data;
  });

  const questions = flatMapDeep(
    survey?.categories.map((category) =>
      category.trends.map((trend) => trend.questions)
    )
  );

  const allResponses = surveyResponse?.surveysAnswers?.[0].answers;

  const questionsWithAnswers = questions.map((question) => ({
      question,
      answer: find(allResponses, { questionId: question._id }),
  }));

  const shuffledData = useMemo(() => shuffle(questionsWithAnswers), [questionsWithAnswers.length])

  const buttonActive = size(questions) === size(allResponses);

  const renderContent = useMemo(
    () =>
      surveyIsFinished && mode === "result" ? (
        <Chart data={surveyFinished} />
      ) : (
        <Center>
          <div style={{ width: "50vw" }}>
            <ul>
            {shuffledData.map(({ answer, question }) => (
              <QuestionResponse
                answer={answer ? toNumber(answer.value) : undefined}
                disabled={surveyIsFinished}
                key={question.title}
                question={question}
                refetch={refetch}
                surveyId={surveyId || ""}
              />
            ))}
            </ul>

            {!surveyIsFinished && (
              <Button
                onClick={() => finishSurvey.mutate()}
                disabled={!buttonActive}
                fullWidth
                color="green"
                style={{ marginBottom: "20px", marginTop: "10px" }}
              >
                Submit responses
              </Button>
            )}
          </div>
        </Center>
      ),
    [
      buttonActive,
      finishSurvey,
      mode,
      surveyId,
      questionsWithAnswers,
      refetch,
      surveyFinished,
      surveyIsFinished,
    ]
  );

  if (isLoadingSurvey || isLoadingSurveyResponse || isLoadingSurveyFinished) {
    return <span>Loading survey</span>;
  }

  if (errorLoadingSurvey) {
    return <span>Error loading survey</span>;
  }

  if (errorLoadingSurveyResponse) {
    return <span>Error loading survey response</span>;
  }

  return (
    <>
      <Group style={{ justifyContent: "space-between" }}>
        <h1>{survey?.title}</h1>
        {surveyIsFinished && (
          <SegmentedControl
            color="green"
            data={[
              { value: "result", label: "Result" },
              { value: "surveyEdit", label: "Show Survery" },
            ]}
            value={mode}
            onChange={setMode}
          />
        )}
      </Group>
      {renderContent}
    </>
  );
}
