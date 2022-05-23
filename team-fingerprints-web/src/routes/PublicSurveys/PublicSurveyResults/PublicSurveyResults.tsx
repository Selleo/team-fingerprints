import axios from "axios";
import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { uniqueId, filter } from "lodash";
import { Button, Collapse } from "@mantine/core";

import LoadingData from "../../../components/LoadingData";
import ErrorLoading from "../../../components/ErrorLoading";
import Chart from "../../../components/Chart/Chart";
import BackToScreen from "../../../components/BackToScreen/BackToScreen";
import ResultsFilters from "./PublicResultsFilters/PublicResultsFilters";
import ColoredShape from "../../../components/ColoredShape";
import SurveyFinishedWrapper from "../../../components/SurveyFinishedWrapper/SurveyFinishedWrapper";

import { Switch } from "../../../components/Switch";
import {
  SurveyDetails,
  ChangeFilterValue,
  FilterSets,
} from "../../../types/models";
import FiltersSets from "../../../components/FiltersSets";

export default function PublicSurveyResults() {
  const { surveyId } = useParams();
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

  const { isLoading: isLoadingSurvey, data: surveyResult } = useQuery<
    any,
    Error
  >([`publicSurvey-${surveyId}`], async () => {
    const { data } = await axios.get<SurveyDetails>(
      `/survey-results/${surveyId}/companies/`
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
            apiUrl={`${surveyId}/companies`}
            isPublic={true}
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
}
