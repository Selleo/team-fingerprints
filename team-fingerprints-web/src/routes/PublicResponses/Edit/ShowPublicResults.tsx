import axios from "axios";
import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { AdditionalData, CategoryResults, Shape } from "../../../types/models";
import { uniqueId, cloneDeep, filter } from "lodash";
import { Button, Collapse } from "@mantine/core";

import LoadingData from "../../../components/LoadingData";
import ErrorLoading from "../../../components/ErrorLoading";
import Chart from "../../../components/Chart/Chart";
import BackToScreen from "../../../components/BackToScreen/BackToScreen";
import ResultsFilters from "./ResultsFilters/ResultsFilters";
import ColoredShape from "../../../components/ColoredShape";
import SurveyFinishedWrapper from "../../../components/SurveyFinishedWrapper/SurveyFinishedWrapper";

import { SurveyDetails } from "../../../types/models";
import { Switch } from "../../../components/Switch";

type FiltersSet = AdditionalData & {
  visible: boolean;
  filterValues:
    | object
    | {
        index: string;
        value: Array<string>;
      };
  collapsed: boolean;
};

export default function ShowPublicResults() {
  const { surveyId } = useParams();
  const [filtersSets, setFiltersSets] = useState<FiltersSet[]>([]);

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
    const { data } = await axios.get<any>(
      `/survey-results/${surveyId}/companies`
    );
    return data;
  });

  const { data: availableFilters } = useQuery<any, Error>(
    ["surveyFiltersPublic", surveyId],
    async () => {
      const { data } = await axios.get<any>(
        `/survey-results/companies/filters/${surveyId}`
      );
      return data;
    }
  );

  const createFilterSet = () => {
    const id = uniqueId();
    const lightColor = "hsl(" + Math.floor(Math.random() * 361) + ",50%,75%)";
    setFiltersSets([
      ...filtersSets,
      {
        id: id,
        name: `Filter Set #${id}`,
        icon: "trapeze",
        color: lightColor,
        categories: [],
        visible: true,
        filterValues: {},
        collapsed: false,
      },
    ]);
  };

  const changeFilterValue =
    (index: number) => (valueName: string, newValue: any) => {
      setFiltersSets((prev) => {
        const copy = cloneDeep(prev);
        copy[index] = { ...copy[index], [valueName]: newValue };
        return copy;
      });
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
          {filtersSets.map((filterSet, index) => {
            return (
              <React.Fragment key={index}>
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
                      changeFilterValue(index)("visible", !filterSet.visible)
                    }
                  />
                  <Button
                    className="survey-response__filters__item__collapse"
                    onClick={() =>
                      changeFilterValue(index)(
                        "collapsed",
                        !filterSet.collapsed
                      )
                    }
                  >
                    &#8595;
                  </Button>
                </div>
                <Collapse
                  className="survey-response__filters__item__selects"
                  in={filterSet.collapsed}
                >
                  {surveyId && (
                    <ResultsFilters
                      currentFiltersValues={filterSet.filterValues}
                      availableFilters={availableFilters}
                      id={filterSet.id}
                      surveyId={surveyId}
                      changeFilterValue={changeFilterValue(index)}
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
}
