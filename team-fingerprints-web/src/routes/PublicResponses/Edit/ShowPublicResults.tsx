import axios from "axios";
import React, { useMemo, useState, useEffect } from "react";
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

import { SurveyDetails } from "../../../types/models";
import { Switch } from "../../../components/Switch";

import "./styles.sass";

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

  const {
    isLoading: isLoadingSurvey,
    data: surveyResult,
    refetch: refetchSurveyResult,
  } = useQuery<any, Error>(["publicSurvey", surveyId, "all"], async () => {
    const { data } = await axios.get<any>(
      `/survey-results/${surveyId}/companies`
    );
    return data;
  });

  const { data: availableFilters } = useQuery<any, Error>(
    ["surveyFiltersPublic"],
    async () => {
      const { data } = await axios.get<any>(
        `/survey-results/companies/filters`
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

  const toggleFiltersVisibility = (index: number) => {
    setFiltersSets((prev) => {
      const copy = cloneDeep(prev);
      copy[index] = { ...copy[index], visible: !copy[index].visible };
      return copy;
    });
  };

  const toggleCollapse = (index: number) => {
    setFiltersSets((prev) => {
      const copy = cloneDeep(prev);
      copy[index] = { ...copy[index], collapsed: !copy[index].collapsed };
      return copy;
    });
  };

  const setFilterValues =
    (index: number) =>
    (newFilterValue: { index?: string; value?: Array<string> }) => {
      setFiltersSets((prev) => {
        const copy = cloneDeep(prev);
        copy[index] = { ...copy[index], filterValues: newFilterValue };
        return copy;
      });
    };

  const setFilterResults =
    (index: number) => (newFilterResults: CategoryResults[]) => {
      setFiltersSets((prev) => {
        const copy = cloneDeep(prev);
        copy[index] = { ...copy[index], categories: newFilterResults };
        return copy;
      });
    };

  const setFilterShape = (index: number) => (newShape: Shape) => {
    setFiltersSets((prev) => {
      const copy = cloneDeep(prev);
      copy[index] = { ...copy[index], icon: newShape };
      return copy;
    });
  };

  const setFilterColor = (index: number) => (newColor: string) => {
    setFiltersSets((prev) => {
      const copy = cloneDeep(prev);
      copy[index] = { ...copy[index], color: newColor };
      return copy;
    });
  };

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
                      setValue={() => toggleFiltersVisibility(index)}
                    />
                    <Button
                      className="survey-response__filters__item__collapse"
                      onClick={() => toggleCollapse(index)}
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
                        setFilterValues={setFilterValues(index)}
                        surveyId={surveyId}
                        setFilterResults={setFilterResults(index)}
                        setFilterShape={setFilterShape(index)}
                        setFilterColor={setFilterColor(index)}
                      />
                    )}
                  </Collapse>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <Chart
          surveyResult={Object.values(surveyResult || {})}
          additionalData={filter(filtersSets, "visible")}
          showMe={true}
        />
      </div>
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
