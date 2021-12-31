import React from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { SurveyDetails, SurveyResponse } from "../../../types/models";
import { useQuery } from "react-query";
import { flatMapDeep } from "lodash";
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
      `/survey/${params.surveyId}`
    );
    return response.data;
  });

  const {
    isLoading: isLoadingSurveyResponse,
    error: errorLoadingSurveyResponse,
    data: surveyResponse,
  } = useQuery<SurveyResponse, Error>("surveyResponseOne", async () => {
    const response = await axios.get<SurveyResponse>(
      `/survey-response/${user._id}/surveyId/${params.surveyId}`
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

  console.log({ surveyResponse });

  const questions = flatMapDeep(
    survey?.categories.map((category) =>
      category.trends.map((trend) => trend.questions)
    )
  );

  const questionsWithAnswers = questions.map((question) => {
    return {
      question,
      answer: undefined,
    };
  });

  return (
    <>
      <h1>{survey?.title}</h1>
      {questionsWithAnswers.map((questionsWithAnswer) => (
        <QuestionResponse
          surveyId={params.surveyId || ""}
          question={questionsWithAnswer.question}
          answer={questionsWithAnswer.answer}
        />
      ))}
    </>
  );
}
