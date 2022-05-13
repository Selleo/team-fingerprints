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

import { Switch } from "../../../../components/Switch";
import { SurveyDetails, FiltersSet } from "../../../../types/models";

const SurveyResults = () => {
  const { companyId, surveyId } = useParams();
  const [filterSurveyResults, setFilterSurveyResults] = useState([]);

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
    data: FiltersData,
    refetch: refetchFilters,
  } = useQuery<any, Error>(["filterSets"], async () => {
    const { data } = await axios.get<any>(
      `/filter-templates/${surveyId}/companies/${companyId}/filters`
    );
    const getFilterSet = { ...data };
    return getFilterSet;
  });

  const createMutation = useMutation(
    async (filtersSets: any) => {
      return axios.post(
        `/filter-templates/${surveyId}/companies/${companyId}/filters`,
        filtersSets
      );
    },
    {
      onSuccess: () => {
        refetchFilters();
      },
    }
  );

  const updateMutation = useMutation(
    async (values: any) => {
      return axios.put(
        `/filter-templates/${surveyId}/companies/${companyId}/filters/${values._id}`,
        values
      );
    },
    {
      onSuccess: () => {
        refetchFilters();
      },
    }
  );

  const deleteMutation = useMutation(
    async (filterSetId: any) => {
      const newFilterSurveyResult = { ...filterSurveyResults };
      delete newFilterSurveyResult[filterSetId];
      setFilterSurveyResults(newFilterSurveyResult);
      return axios.delete(
        `/filter-templates/${surveyId}/companies/${companyId}/filters/${filterSetId}`
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

    const newFilterSet = {
      name: `Filter Set #${id}`,
      pointColor: lightColor,
      pointShape: "trapeze",
      categories: [],
      visible: true,
      collapsed: true,
      filters: {},
    };

    createMutation.mutate(newFilterSet);
  };

  const changeFilterValue: any = (values: any) => {
    updateMutation.mutate(values);
  };

  if (isLoadingSurveys || isLoadingSurvey) {
    return <LoadingData title="Loading survey" />;
  }

  if (errorLoadingSurvey) {
    return <ErrorLoading title="Can't load survey info" />;
  }

  if (isLoadingFilters) {
    return null;
  }

  return (
    <>
      <div className="app-shell">
        <BackToScreen name="Dashboard" />
        <div className="survey-response">
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
              {Object.values(FiltersData)?.map((filterSet: any) => {
                return (
                  <React.Fragment key={filterSet?._id}>
                    <div className="survey-response__filters__item">
                      <div className="survey-response__filters__item__icon">
                        <ColoredShape
                          shape={filterSet?.pointShape}
                          color={filterSet?.pointColor}
                        />
                      </div>
                      <span>{filterSet?.name}</span>
                      <Switch
                        value={!!filterSet.visible}
                        setValue={() =>
                          changeFilterValue({
                            ...filterSet,
                            visible: !filterSet.visible,
                          })
                        }
                      />

                      <Button
                        className="survey-response__filters__item__collapse"
                        onClick={() =>
                          changeFilterValue({
                            ...filterSet,
                            collapsed: !filterSet.collapsed,
                          })
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
                          currentFiltersValues={filterSet.filters}
                          filterSet={filterSet}
                          surveyId={surveyId}
                          changeFilterValue={changeFilterValue}
                          setFilterSurveyResults={setFilterSurveyResults}
                          filterSurveyResults={filterSurveyResults}
                        />
                      )}
                    </Collapse>
                  </React.Fragment>
                );
              })}
            </div>

            <Chart
              surveyResult={Object.values(surveyResult || {})}
              additionalData={filter(filterSurveyResults, "visible")}
              showMe={true}
            />
          </SurveyFinishedWrapper>
        </div>
      </div>
    </>
  );
};

export default SurveyResults;
