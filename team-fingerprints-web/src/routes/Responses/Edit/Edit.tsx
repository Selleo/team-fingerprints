import { useContext, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import { each, find, flatMapDeep, isEmpty, keys, size, toNumber } from "lodash";
import { Button, Center } from "@mantine/core";
import axios from "axios";

import useDefaultErrorHandler from "../../../hooks/useDefaultErrorHandler";
import LoadingData from "../../../components/LoadingData";
import ErrorLoading from "../../../components/ErrorLoading";
import SingleCompanyResult from "./SingleCompanyResult/SingleCompanyResult";
import ColoredShape from "../../../components/ColoredShape";
import Chart from "../../../components/Chart";
import QuestionResponse from "../../../components/Response/QuestionResponse/QuestionResponse";
import BackToScreen from "../../../components/BackToScreen/BackToScreen";

import {
  AdditionalData,
  ComplexRole,
  SurveyDetails,
} from "../../../types/models";
import { Switch } from "../../../components/Switch";
import { ProfileContext } from "../../../routes";
import { ReactComponent as CircleIcon } from "../../../assets/shapes/Circle.svg";

import "./styles.sass";

type ResultsPerCompany = {
  [key: string]: {
    role: ComplexRole;
    categoriesArray: any[];
  };
};

export default function Edit() {
  const [visibleData, setVisibleData] = useState<any>({});
  const { profile } = useContext(ProfileContext);
  const [showMyResults, setShowMyResults] = useState(true);
  const { onErrorWithTitle } = useDefaultErrorHandler();
  const [companiesResults, setCompaniesResult] = useState<ResultsPerCompany>(
    {}
  );

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

  // const { isLoading: isLoadingSurveyResultsAll, data: serveyResultsAll } =
  //   useQuery<any, Error>(`surveyResultsAll-${surveyId}`, async () => {
  //     const { data } = await axios.get<any>(
  //       `/survey-results/${surveyId}/companies`
  //     );
  //     return data;
  //   });

  // const { isLoading: isLoadingTeamResults, data: serveyResultsTeam } = useQuery<
  //   any,
  //   Error
  // >(`surveyResultsAll-${surveyId}-${profile?.company?._id}`, async () => {
  //   if (profile?.team?._id) {
  //     const { data } = await axios.get<any>(
  //       `/survey-results/${surveyId}/companies/${profile?.company?._id}/team/${profile?.team?._id}`
  //     );
  //     return data;
  //   } else return null;
  // });

  const additionalData = useMemo(() => {
    let tmp: AdditionalData[] = [];
    let visibility = {};
    // if (serveyResultsAll) {
    //   tmp.push({
    //     categories: values(serveyResultsAll),
    //     color: "orange",
    //     icon: "square",
    //   });
    // }
    // if (profile?.team?._id && serveyResultsTeam) {
    //   const id = "team";
    //   tmp.push({
    //     categories: values(serveyResultsTeam),
    //     color: "yellow",
    //     icon: "square",
    //     id,
    //   });
    //   visibility = { ...visibility, [id]: true };
    // }
    if (!isEmpty(companiesResults)) {
      each(keys(companiesResults), (companyId) => {
        const dataAndRoleForCompany = companiesResults[companyId];
        tmp.push({
          categories: dataAndRoleForCompany.categoriesArray,
          color: dataAndRoleForCompany.role.company.pointColor,
          icon: dataAndRoleForCompany.role.company.pointShape,
          id: companyId,
          name: dataAndRoleForCompany.role.company.name,
        });
        visibility = { ...visibility, [companyId]: true };
      });
    }
    setVisibleData(visibility);
    return tmp;
  }, [companiesResults]);

  const filteredAdditionalData = useMemo(() => {
    return additionalData.filter((element) => {
      return visibleData[element.id];
    });
  }, [additionalData, visibleData]);

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

  const buttonActive = size(questions) === size(allResponses);

  const setDataForCompany =
    (role: ComplexRole) => (companyId: string, categoriesArray: any[]) => {
      setCompaniesResult((prev) => ({
        ...prev,
        [companyId]: { categoriesArray, role },
      }));
    };

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
            {keys(visibleData).map((key) => {
              const singleVisibleData = additionalData.find(
                (el) => el.id === key
              );
              return (
                <div className="survey-response__legend__item survey-response__legend__item--first">
                  <div className="survey-response__legend__item__icon">
                    <ColoredShape
                      shape={singleVisibleData?.icon}
                      color={singleVisibleData?.color}
                    />
                  </div>
                  <span>{singleVisibleData?.name}</span>
                  <Switch
                    value={!!visibleData[key]}
                    setValue={() =>
                      setVisibleData({
                        ...visibleData,
                        [key]: !visibleData[key],
                      })
                    }
                  />
                </div>
              );
            })}
          </div>

          <Chart
            data={surveyFinished}
            additionalData={filteredAdditionalData}
            showMe={showMyResults}
          />
        </>
      ) : (
        <Center>
          <div style={{ width: "50vw" }}>
            <ul>
              {questionsWithAnswers.map(({ answer, question }) => (
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
      visibleData,
      surveyFinished,
      filteredAdditionalData,
      questionsWithAnswers,
      buttonActive,
      refetch,
      surveyId,
      finishSurvey,
    ]
  );

  if (
    isLoadingSurvey ||
    isLoadingSurveyResponse ||
    isLoadingSurveyFinished
    //|| isLoadingSurveyResultsCompany
    //|| isLoadingTeamResults
  ) {
    return <LoadingData title="Loading survey" />;
  }

  if (errorLoadingSurvey) {
    return <ErrorLoading title="Can't load survey info" />;
  }

  if (errorLoadingSurveyResponse) {
    return <ErrorLoading title="Can't load survey responses" />;
  }

  return (
    <>
      <BackToScreen name="Dashboard" />
      <div className="survey-response">{renderContent}</div>
      {profile?.privileges.map((role) => (
        <>
          {surveyId && (
            <SingleCompanyResult
              surveyId={surveyId}
              companyId={role.company?._id}
              setDataForCompany={setDataForCompany(role)}
            />
          )}
        </>
      ))}
    </>
  );
}
