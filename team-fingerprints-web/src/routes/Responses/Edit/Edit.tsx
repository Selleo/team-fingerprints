import axios from "axios";
import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import { find, flatMapDeep, get, isEmpty, last, size, sortBy } from "lodash";

import useDefaultErrorHandler from "../../../hooks/useDefaultErrorHandler";
import LoadingData from "../../../components/LoadingData";
import ErrorLoading from "../../../components/ErrorLoading";
import QuestionResponse from "../../../components/Response/QuestionResponse";
import BackToScreen from "../../../components/BackToScreen/BackToScreen";
import SurveyResults from "./SurveyResults";

import { SurveyDetails } from "../../../types/models";

export default function Edit() {
  const { onErrorWithTitle } = useDefaultErrorHandler();

  const { surveyId } = useParams();
  const {
    isLoading: isLoadingSurvey,
    error: errorLoadingSurvey,
    data: survey,
  } = useQuery<SurveyDetails, Error>(`surveyOne${surveyId}`, async () => {
    const { data } = await axios.get<SurveyDetails>(`/surveys/${surveyId}`);
    return data;
  });

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
      onError: onErrorWithTitle("Can finish survey"),
    }
  );

  const surveyIsFinished =
    surveyFinished?.surveysAnswers?.[0].completionStatus === "finished";

  const {
    isLoading: isLoadingSurveyResponse,
    error: errorLoadingSurveyResponse,
    data: surveyResponse,
    refetch,
  } = useQuery<any, Error>(`surveyResponseOne-${surveyId}`, async () => {
    const { data } = await axios.get<any>(`/survey-answers/${surveyId}`);
    return data;
  });

  const questions = sortBy(
    flatMapDeep(
      survey?.categories.map((category) =>
        category.trends.map((trend) => trend.questions)
      )
    ),
    (question) => {
      const middleIndex = size(question._id) / 2 - 5;
      if (middleIndex >= 0) {
        return `${last(question._id)}${get(question._id, middleIndex)}`;
      }
      return last(question._id);
    }
  );

  const allResponses = surveyResponse?.surveysAnswers?.[0].answers;

  const questionsWithAnswers = questions.map((question) => ({
    question,
    answer: find(allResponses, { questionId: question._id }),
  }));

  if (isLoadingSurvey || isLoadingSurveyResponse || isLoadingSurveyFinished) {
    return <LoadingData title="Loading survey" />;
  }

  if (finishSurvey.isLoading) {
    return <LoadingData title="Calculating data" />;
  }

  if (errorLoadingSurvey) {
    return (
      <>
        <BackToScreen name="Dashboard" />
        <ErrorLoading title="Can't load survey info" />
      </>
    );
  }

  if (errorLoadingSurveyResponse) {
    return (
      <>
        <BackToScreen name="Dashboard" />
        <ErrorLoading title="Can't load survey responses" />
      </>
    );
  }

  if (isEmpty(questionsWithAnswers)) {
    return (
      <>
        <BackToScreen name="Dashboard" />
        <ErrorLoading title="Survey is empty" />
      </>
    );
  }

  if (surveyIsFinished) {
    return (
      <>
        <BackToScreen name="Dashboard" />
        <SurveyResults surveyFinished={surveyFinished} survey={survey} />
      </>
    );
  }

  return (
    <>
      <BackToScreen name="Dashboard" />
      <QuestionResponse
        questionsWithAnswers={questionsWithAnswers}
        refetch={refetch}
        disabled={surveyIsFinished}
        surveyId={surveyId || ""}
        finishSurvey={finishSurvey.mutate}
        surveyTitle={survey?.title}
      />
    </>
  );
}
