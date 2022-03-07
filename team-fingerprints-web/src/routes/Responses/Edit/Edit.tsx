import React, { useContext, useMemo, useState } from "react";

import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import { find, flatMapDeep, shuffle, size, toNumber, values } from "lodash";
import { Button, Center } from "@mantine/core";
import axios from "axios";

import { AdditionalData, SurveyDetails } from "../../../types/models";

import { ReactComponent as SquareIcon } from "../../../assets/shapes/Square.svg";
import { ReactComponent as CircleIcon } from "../../../assets/shapes/Circle.svg";
import { ReactComponent as TriangleIcon } from "../../../assets/shapes/Triangle.svg";

import Chart from "../../../components/Chart";
import QuestionResponse from "../../../components/Response/QuestionResponse/QuestionResponse";
import BackToScreen from "../../../components/BackToScreen/BackToScreen";

import "./styles.sass";
import { Switch } from "../../../components/Switch";
import { ProfileContext } from "../../../routes";

export default function Edit() {
  const [visibleData, setVisibleData] = useState([true, true, true]);
  const { profile } = useContext(ProfileContext);
  const [showMyResults, setShowMyResults] = useState(true);

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

  const { isLoading: isLoadingSurveyResultsAll, data: serveyResultsAll } =
    useQuery<any, Error>(`surveyResultsAll-${surveyId}`, async () => {
      const { data } = await axios.get<any>(
        `/survey-results/${surveyId}/companies/${profile?.company?._id}`
      );
      return data;
    });

  const additionalData = useMemo(() => {
    let tmp: AdditionalData[] = [];
    if (serveyResultsAll) {
      tmp.push({
        categories: values(serveyResultsAll),
        color: "red",
        icon: "triangle",
      });
    }
    return tmp;
  }, [serveyResultsAll]);

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

  const shuffledData = useMemo(
    () => shuffle(questionsWithAnswers),
    [questionsWithAnswers.length]
  );

  const buttonActive = size(questions) === size(allResponses);

  const renderContent = useMemo(
    () =>
      surveyIsFinished ? (
        <>
          <div className="survey-response__description">
            <h5 className="survey-response__description__info">Results</h5>
            <h1 className="survey-response__description__title">
              {survey?.title || "Survey Name"}
            </h1>
            <div className="survey-response__description__copy">
              Compare your results with the company, the world or other
              employees. To display the data on the chart, turn on the switch
              next to the category name.
            </div>
          </div>
          <div className="survey-response__legend">
            <div className="survey-response__legend__item survey-response__legend__item--first">
              <div className="survey-response__legend__item__icon">
                <CircleIcon stroke={"#32A89C"} />
              </div>
              <span>You</span>
              <Switch value={showMyResults} setValue={setShowMyResults} />
            </div>
            {additionalData.map((item) => {})}
          </div>

          <Chart data={surveyFinished} additionalData={additionalData} />
        </>
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
      surveyIsFinished,
      survey?.title,
      showMyResults,
      additionalData,
      surveyFinished,
      shuffledData,
      buttonActive,
      refetch,
      surveyId,
      finishSurvey,
    ]
  );

  if (
    isLoadingSurvey ||
    isLoadingSurveyResponse ||
    isLoadingSurveyFinished ||
    isLoadingSurveyResultsAll
  ) {
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
      <BackToScreen name="Dashboard" />
      <div className="survey-response">{renderContent}</div>
    </>
  );
}
