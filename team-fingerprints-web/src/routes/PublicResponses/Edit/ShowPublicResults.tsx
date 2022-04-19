import { useMemo, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";

import LoadingData from "../../../components/LoadingData";
import ErrorLoading from "../../../components/ErrorLoading";
import Chart from "../../../components/Chart/Chart";
import BackToScreen from "../../../components/BackToScreen/BackToScreen";
import ResultsFilters from "./ResultsFilters";

import { SurveyDetails } from "../../../types/models";

import "./styles.sass";

export default function ShowPublicResults() {
  const { surveyId } = useParams();
  const [filterValues, setFilterValues] = useState({});

  const {
    isLoading: isLoadingSurveys,
    error: errorLoadingSurvey,
    data: survey,
  } = useQuery<SurveyDetails, Error>("publicSurveysList", async () => {
    const { data } = await axios.get<SurveyDetails>(
      `/surveys/${surveyId}/public`
    );
    return data;
  });

  const {
    isLoading: isLoadingSurvey,
    data: surveyResult,
    refetch: refetchSurveyResult,
  } = useQuery<any, Error>(["publicSurvey", surveyId], async () => {
    const { data } = await axios.get<any>(
      `/survey-results/${surveyId}/companies`,
      { params: filterValues }
    );
    return data;
  });

  useEffect(() => {
    refetchSurveyResult();
  }, [filterValues]);

  const renderContent = useMemo(
    () => (
      <div className="survey-response__finished">
        <div className="survey-response__description">
          <h5 className="survey-response__description__info">Results</h5>
          <h1 className="survey-response__description__title">
            {survey?.title || "Survey Name"}
          </h1>
          <div className="survey-response__description__copy">
            See trends in companies.
          </div>
        </div>
        <ResultsFilters setFilterValues={setFilterValues} />
        <Chart
          surveyResult={Object.values(surveyResult || {})}
          additionalData={[]}
          showMe={true}
        />
      </div>
    ),
    [survey?.title, surveyResult, surveyId, ResultsFilters]
  );

  if (isLoadingSurveys || isLoadingSurvey) {
    return <LoadingData title="Loading survey" />;
  }

  if (errorLoadingSurvey) {
    return <ErrorLoading title="Can't load survey info" />;
  }

  return (
    <>
      <div className="app-shell">
        <BackToScreen name="Dashboard" />
        <div className="survey-response">{renderContent}</div>
      </div>
    </>
  );
}
