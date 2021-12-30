import React from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { SurveyDetails } from "../../../types/models";
import { useQuery } from "react-query";
import { flatMapDeep } from "lodash";
import QuestionResponse from "../../../components/Response/QuestionResponse/QuestionResponse";

export default function Edit() {
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

  if (isLoadingSurvey) {
    return <span>Loading survey</span>;
  }

  if (errorLoadingSurvey) {
    return <span>Error loading survey</span>;
  }

  const questions = flatMapDeep(
    survey?.categories.map((category) =>
      category.trends.map((trend) => trend.questions)
    )
  );

  return (
    <>
      <h1>{survey?.title}</h1>
      {questions.map((question) => (
        <QuestionResponse item={question} />
      ))}
    </>
  );
}
