import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import { uniqueId, filter } from "lodash";
import { Button, Collapse } from "@mantine/core";

import LoadingData from "../../../../components/LoadingData";
import ErrorLoading from "../../../../components/ErrorLoading";
import Chart from "../../../../components/Chart/Chart";
import BackToScreen from "../../../../components/BackToScreen/BackToScreen";
import ResultsFilters from "./ResultsFilters";
import ColoredShape from "../../../../components/ColoredShape";
import SurveyFinishedWrapper from "../../../../components/SurveyFinishedWrapper/SurveyFinishedWrapper";
import ModalWrapper from "../../../../components/Modals/ModalWrapper";

import { Switch } from "../../../../components/Switch";
import { SurveyDetails, FilterSets } from "../../../../types/models";
import FiltersSets from "../../../../components/FiltersSets";

const TeamSurveyResults = () => {
  const { companyId, teamId, surveyId } = useParams();
  const [filterSets, setFilterSets] = useState<FilterSets>({});

  const {
    isLoading: isLoadingSurveys,
    error: errorLoadingSurvey,
    data: survey,
  } = useQuery<SurveyDetails, Error>("teamSurveysList", async () => {
    const { data } = await axios.get<SurveyDetails>(
      `/surveys/${surveyId}/public`
    );
    return data;
  });

  const { isLoading: isLoadingSurvey, data: surveyResult } = useQuery<
    any,
    Error
  >([`teamSurvey-${surveyId}`, teamId], async () => {
    const { data } = await axios.get<SurveyDetails>(
      `/survey-results/${surveyId}/companies/${companyId}/teams/${teamId}`
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
            apiUrl={`${surveyId}/companies/${companyId}/teams/${teamId}`}
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

export default TeamSurveyResults;
