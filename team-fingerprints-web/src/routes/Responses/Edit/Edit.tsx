import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { SurveyDetails } from "../../../types/models";
import { useMutation, useQuery } from "react-query";
import { find, flatMapDeep, size, toNumber } from "lodash";
import { Button, Center, Group, SegmentedControl } from "@mantine/core";
import QuestionResponse from "../../../components/Response/QuestionResponse/QuestionResponse";
import Chart from "../../../components/Chart";

export default function Edit() {
  const [mode, setMode] = useState("result");
  const params = useParams();
  const {
    isLoading: isLoadingSurvey,
    error: errorLoadingSurvey,
    data: survey,
  } = useQuery<SurveyDetails, Error>(
    `surveyOne${params.surveyId}`,
    async () => {
      const response = await axios.get<SurveyDetails>(
        `/surveys/${params.surveyId}`
      );
      return response.data;
    }
  );

  const {
    isLoading: isLoadingSurveyFinished,
    data: surveyFinished,
    refetch: refetchIsFinished,
  } = useQuery<any, Error>(`surveyFinishedOne-${params.surveyId}`, async () => {
    const response = await axios.get<any>(`/survey-answers/${params.surveyId}`);
    return response.data;
  });

  const finishSurvey = useMutation(
    async () => {
      return axios.post(`/survey-answers/${params.surveyId}/finish`);
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
  } = useQuery<any, Error>(`surveyResponseOne-${params.surveyId}`, async () => {
    const response = await axios.get<any>(`/survey-answers/${params.surveyId}`);
    return response.data;
  });

  const questions = flatMapDeep(
    survey?.categories.map((category) =>
      category.trends.map((trend) => trend.questions)
    )
  );

  const allResponses = surveyResponse?.surveysAnswers?.[0].answers;

  const questionsWithAnswers = questions.map((question) => {
    return {
      question,
      answer: find(allResponses, { questionId: question._id }),
    };
  });

  const buttonActive = size(questions) === size(allResponses);

  const renderContent = useMemo(
    () =>
      surveyIsFinished && mode === "result" ? (
        <Chart data={surveyFinished} />
      ) : (
        <Center>
          <div style={{ width: "50vw" }}>
            {questionsWithAnswers.map((questionsWithAnswer) => (
              <QuestionResponse
                disabled={surveyIsFinished}
                refetch={refetch}
                surveyId={params.surveyId || ""}
                question={questionsWithAnswer.question}
                answer={
                  questionsWithAnswer.answer
                    ? toNumber(questionsWithAnswer.answer.value)
                    : undefined
                }
              />
            ))}

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
      params.surveyId,
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
