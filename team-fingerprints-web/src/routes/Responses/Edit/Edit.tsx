import { useContext, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import { each, find, flatMapDeep, isEmpty, keys, size } from "lodash";
import axios from "axios";

import useDefaultErrorHandler from "../../../hooks/useDefaultErrorHandler";
import LoadingData from "../../../components/LoadingData";
import ErrorLoading from "../../../components/ErrorLoading";
import SingleCompanyResult from "./SingleCompanyResult/SingleCompanyResult";
import ColoredShape from "../../../components/ColoredShape";
import Chart from "../../../components/Chart";
import QuestionResponse from "../../../components/Response/QuestionResponse";
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
import SingleTeamResult from "./SingleTeamResult";

type ResultsPerCompany = {
  [key: string]: {
    role: ComplexRole;
    categoriesArray: any[];
    team: boolean;
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

  const additionalData = useMemo(() => {
    let tmp: AdditionalData[] = [];
    let visibility = {};

    if (!isEmpty(companiesResults)) {
      each(keys(companiesResults), (companyOrTeamId) => {
        const dataAndRoleForCompany = companiesResults[companyOrTeamId];

        if (dataAndRoleForCompany.team) {
          tmp.push({
            categories: dataAndRoleForCompany.categoriesArray,
            color: dataAndRoleForCompany.role.team.pointColor,
            icon: dataAndRoleForCompany.role.team.pointShape,
            id: companyOrTeamId,
            name: `${dataAndRoleForCompany.role.company.name} / ${dataAndRoleForCompany.role.team.name}`,
          });
        } else {
          tmp.push({
            categories: dataAndRoleForCompany.categoriesArray,
            color: dataAndRoleForCompany.role.company.pointColor,
            icon: dataAndRoleForCompany.role.company.pointShape,
            id: companyOrTeamId,
            name: dataAndRoleForCompany.role.company.name,
          });
        }

        visibility = { ...visibility, [companyOrTeamId]: true };
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
        [companyId]: { categoriesArray, role, team: false },
      }));
    };

  const setDataForTeam =
    (role: ComplexRole) =>
    (_companyId: string, teamId: string, categoriesArray: any[]) => {
      setCompaniesResult((prev) => ({
        ...prev,
        [teamId]: { categoriesArray, role, team: true },
      }));
    };

  const renderContent = useMemo(
    () =>
      surveyIsFinished ? (
        <div className="survey-response__finished">
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
        </div>
      ) : (
        <QuestionResponse
          questionsWithAnswers={questionsWithAnswers}
          refetch={refetch}
          disabled={surveyIsFinished}
          surveyId={surveyId || ""}
          finishSurvey={finishSurvey.mutate}
          surveyTitle={survey?.title}
        />
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
      additionalData,
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
          {surveyId && role.company?._id && (
            <SingleCompanyResult
              surveyId={surveyId}
              companyId={role.company?._id}
              setDataForCompany={setDataForCompany(role)}
            />
          )}
          {surveyId && role.team?._id && (
            <SingleTeamResult
              surveyId={surveyId}
              companyId={role.company?._id}
              teamId={role.team?._id}
              setDataForTeam={setDataForTeam(role)}
            />
          )}
        </>
      ))}
    </>
  );
}
