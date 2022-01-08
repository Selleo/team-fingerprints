import React from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { SurveyDetails } from "../../../types/models";
import { useQuery } from "react-query";
import { find, flatMapDeep, get, size, toNumber } from "lodash";
import { Button } from "@mantine/core";
import QuestionResponse from "../../../components/Response/QuestionResponse/QuestionResponse";
import useUser from "../../../hooks/useUser";

export default function Edit() {
  const { user } = useUser();
  const params = useParams();
  const {
    isLoading: isLoadingSurvey,
    error: errorLoadingSurvey,
    data: survey,
  } = useQuery<SurveyDetails, Error>("surveyOne", async () => {
    const response = await axios.get<SurveyDetails>(
      `/surveys/${params.surveyId}`
    );
    return response.data;
  });

  const {
    isLoading: isLoadingSurveyResponse,
    error: errorLoadingSurveyResponse,
    data: surveyResponse,
    refetch,
  } = useQuery<any, Error>("surveyResponseOne", async () => {
    const response = await axios.get<any>(
      `/survey-responses/${user?._id}/surveyId/${params.surveyId}`
    );
    return response.data;
  });

  if (isLoadingSurvey || isLoadingSurveyResponse) {
    return <span>Loading survey</span>;
  }

  if (errorLoadingSurvey) {
    return <span>Error loading survey</span>;
  }

  if (errorLoadingSurveyResponse) {
    return <span>Error loading survey response</span>;
  }

  const allResponses = surveyResponse?.surveysResponses?.[0].responses;

  const questions = flatMapDeep(
    survey?.categories.map((category) =>
      category.trends.map((trend) => trend.questions)
    )
  );

  const questionsWithAnswers = questions.map((question) => {
    return {
      question,
      answer: get(find(allResponses, { questionId: question._id }), "value"),
    };
  });

  const buttonActive = size(questions) === size(allResponses);

  return (
    <>
      <h1>{survey?.title}</h1>
      {questionsWithAnswers.map((questionsWithAnswer) => (
        <QuestionResponse
          refetch={refetch}
          surveyId={params.surveyId || ""}
          question={questionsWithAnswer.question}
          answer={
            questionsWithAnswer.answer
              ? toNumber(questionsWithAnswer.answer)
              : undefined
          }
        />
      ))}
      <Button
        disabled={!buttonActive}
        fullWidth
        color="green"
        style={{ marginBottom: "20px", marginTop: "10px" }}
      >
        Submit responses
      </Button>
    </>
  );
}
