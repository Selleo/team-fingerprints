import axios from "axios";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { filter } from "lodash";

import LoadingData from "components/LoadingData";
import ErrorLoading from "components/ErrorLoading";
import Chart from "components/Chart";
import BackToScreen from "components/BackToScreen/BackToScreen";
import SurveyFinishedWrapper from "components/SurveyFinishedWrapper/SurveyFinishedWrapper";
import FiltersSets from "components/FiltersSets";
import {
  SurveyDetails,
  FilterSets,
  CompanyResponse,
  TeamResponse,
} from "types/models";

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

  const { data: company } = useQuery<CompanyResponse>(
    `companies${companyId}`,
    async () => {
      const response = await axios.get<CompanyResponse>(
        `/companies/${companyId}`
      );
      return response.data;
    },
    { enabled: !!companyId }
  );

  const { data: team } = useQuery<TeamResponse>(
    `team${teamId}`,
    async () => {
      const response = await axios.get<TeamResponse>(
        `/companies/${companyId}/teams/${teamId}`
      );
      return response.data;
    },
    { enabled: !!teamId }
  );

  const api = useMemo(() => {
    if (teamId) {
      return {
        header: [`teamSurvey-${surveyId}`, companyId, teamId],
        url: `${surveyId}/companies/${companyId}/teams/${teamId}`,
      };
    }
    if (companyId) {
      return {
        header: [`companySurvey-${surveyId}`, companyId],
        url: `${surveyId}/companies/${companyId}`,
      };
    }
    return {
      header: [`publicSurvey-${surveyId}`],
      url: `${surveyId}/companies/`,
    };
  }, [teamId, companyId, surveyId]);

  const description = useMemo(() => {
    if (teamId) {
      return team?.team.name;
    }
    if (companyId) {
      return company?.company.name;
    }
    return "companies.";
  }, [teamId, companyId, surveyId]);

  const { isLoading: isLoadingSurvey, data: surveyResult } = useQuery<
    any,
    Error
  >(api.header, async () => {
    const { data } = await axios.get<SurveyDetails>(
      `/survey-results/${api.url}`
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
          description={`See trends in ${description}`}
        >
          <FiltersSets
            filterSets={filterSets}
            setFilterSets={setFilterSets}
            apiUrl={api.url}
            isPublic={!companyId}
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
