import axios from "axios";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { filter } from "lodash";

import LoadingData from "../../components/LoadingData";
import ErrorLoading from "../../components/ErrorLoading";
import Chart from "../../components/Chart/Chart";
import BackToScreen from "../../components/BackToScreen/BackToScreen";
import SurveyFinishedWrapper from "../../components/SurveyFinishedWrapper/SurveyFinishedWrapper";
import FiltersSets from "../../components/FiltersSets";
import { SurveyDetails, FilterSets } from "../../types/models";

const SurveyResults = () => {
  const { companyId, surveyId, teamId } = useParams();
  const [filterSets, setFilterSets] = useState<FilterSets>({});

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

  const apiUrl = () => {
    if (teamId) {
      return `${surveyId}/companies/${companyId}/teams/${teamId}`;
    } else if (companyId) {
      return `${surveyId}/companies/${companyId}`;
    } else {
      return `${surveyId}/companies/`;
    }
  };

  const { isLoading: isLoadingSurvey, data: surveyResult } = useQuery<
    any,
    Error
  >([`companySurvey-${surveyId}`, companyId], async () => {
    const { data } = await axios.get<SurveyDetails>(
      `/survey-results/${apiUrl()}`
    );
    return data;
  });

  if (isLoadingSurveys || isLoadingSurvey) {
    return <LoadingData title="Loading survey" />;
  }

  if (errorLoadingSurvey) {
    return <ErrorLoading title="Can't load survey info" />;
  }

  return (
    <div className="app-shell">
      <BackToScreen name="Surveys List" />
      <div className="survey-response">
        <SurveyFinishedWrapper
          surveyTitle={survey?.title}
          description="See trends in companies."
        >
          <FiltersSets
            filterSets={filterSets}
            setFilterSets={setFilterSets}
            apiUrl={apiUrl()}
            isPublic={companyId ? false : true}
          />
          <Chart
            surveyResult={Object.values(surveyResult || {})}
            additionalData={filter(filterSets, "visible")}
            showMe={true}
          />
        </SurveyFinishedWrapper>
      </div>
    </div>
  );
};

export default SurveyResults;
