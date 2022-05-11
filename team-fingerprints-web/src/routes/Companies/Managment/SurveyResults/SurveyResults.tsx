import axios from "axios";
import React, { useMemo, useState } from "react";
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

import { Switch } from "../../../../components/Switch";
import {
  SurveyDetails,
  ChangeFilterValue,
  FilterSets,
} from "../../../../types/models";

const SurveyResults = () => {
  const { companyId, surveyId } = useParams();
  const [filtersSets, setFiltersSets] = useState<FilterSets>({});

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
  >(["publicSurvey", surveyId], async () => {
    const { data } = await axios.get<SurveyDetails>(
      `/survey-results/${surveyId}/companies/${companyId}`
    );
    return data;
  });

  const {
    isLoading: isLoadingFilters,
    data: filtersData,
    refetch: refetchFilters,
  } = useQuery<any, Error>(["filterSets", companyId], async () => {
    const { data } = await axios.get<any>(
      `/filter-templates/${companyId}/filters`
    );
    setFiltersSets(data);
    return data;
  });

  console.log("localfilters", filtersSets);

  const createMutation = useMutation(async (filtersSets: any) => {
    return axios.post(`/filter-templates/${companyId}/filters`, filtersSets);
  });

  const deleteMutation = useMutation(
    async (filterSetId: any) => {
      return axios.delete(
        `/filter-templates/${companyId}/filters/${filterSetId}`
      );
    },
    {
      onSuccess: () => {
        refetchFilters();
      },
    }
  );

  const createFilterSet = () => {
    const id = uniqueId();
    const lightColor = "hsl(" + Math.floor(Math.random() * 361) + ",50%,75%)";

    createMutation.mutate({
      templateFilter: {
        country: "",
        yearOfExperience: "",
        level: "",
      },
      templateFilterConfig: {
        name: `Filter Set #${id}`,
        pointColor: "#fff",
        pointShape: "trapeze",
        visible: true,
        collapsed: false,
      },
    });
  };

  const changeFilterValue: ChangeFilterValue = (id, valueName, newValue) => {
    const callback = (filtersSets: FilterSets) => {
      const newFilterSet = {
        ...filtersSets[id],
        [valueName]: newValue,
      };

      const newFilterSets = {
        ...filtersSets,
        [id]: newFilterSet,
      };

      return newFilterSets;
    };

    setFiltersSets(callback);
  };

  const renderContent = useMemo(
    () => (
      <SurveyFinishedWrapper
        surveyTitle={survey?.title}
        description="See trends in companies."
      >
        <Button
          className="survey-response__finished__new-filter-button"
          onClick={createFilterSet}
        >
          Create new filter set
        </Button>
        <div className="survey-response__filters">
          {Object.values(filtersSets).map((filterSet) => {
            return (
              <React.Fragment key={filterSet._id}>
                <div className="survey-response__filters__item">
                  <div className="survey-response__filters__item__icon">
                    <ColoredShape
                      shape={filterSet?.icon}
                      color={filterSet?.color}
                    />
                  </div>
                  <span>{filterSet?.name}</span>
                  <Switch
                    value={!!filterSet.visible}
                    setValue={() =>
                      changeFilterValue(
                        filterSet.id,
                        "visible",
                        !filterSet.visible
                      )
                    }
                  />
                  <Button
                    className="survey-response__filters__item__collapse"
                    onClick={() =>
                      changeFilterValue(
                        filterSet.id,
                        "collapsed",
                        !filterSet.collapsed
                      )
                    }
                  >
                    &#8595;
                  </Button>
                  <Button
                    className="survey-response__filters__item__collapse"
                    onClick={() => deleteMutation.mutate(filterSet._id)}
                  >
                    DELETE
                  </Button>
                </div>
                <Collapse
                  className="survey-response__filters__item__selects"
                  in={filterSet.collapsed}
                >
                  {surveyId && (
                    <ResultsFilters
                      currentFiltersValues={filterSet.filterValues}
                      id={filterSet.id}
                      surveyId={surveyId}
                      changeFilterValue={changeFilterValue}
                    />
                  )}
                </Collapse>
              </React.Fragment>
            );
          })}
        </div>
        <Chart
          surveyResult={Object.values(surveyResult || {})}
          additionalData={filter(filtersSets, "visible")}
          showMe={true}
        />
      </SurveyFinishedWrapper>
    ),
    [survey?.title, surveyResult, surveyId, ResultsFilters, filtersSets]
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
};

export default SurveyResults;
