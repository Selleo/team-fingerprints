import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import { uniqueId, filter } from "lodash";
import { Button, Collapse } from "@mantine/core";

import LoadingData from "../../../../../components/LoadingData";
import ErrorLoading from "../../../../../components/ErrorLoading";
import ResultsFilters from "./ResultsFilters";
import ColoredShape from "../../../../../components/ColoredShape";

import { Switch } from "../../../../../components/Switch";
import { SurveyDetails, FiltersSet } from "../../../../../types/models";

import "./styles.sass";

type Props = {
  filterSets: any;
  setFilterSets: any;
};

const FiltersSets = ({ filterSets, setFilterSets }: Props) => {
  const { companyId, surveyId } = useParams();

  const {
    isLoading: isLoadingFilters,
    data: FiltersData,
    refetch: refetchFilters,
  } = useQuery<any, Error>(["filterSets", surveyId, companyId], async () => {
    const { data } = await axios.get<any>(
      `/filter-templates/${surveyId}/companies/${companyId}/filters`
    );
    const getFilterSet = { ...data };
    return getFilterSet;
  });

  useEffect(() => {
    setFilterSets({ ...FiltersData });
  }, [FiltersData]);

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
      const newFilterSurveyResult = { ...filterSets };
      delete newFilterSurveyResult[filterSetId];
      setFilterSets(newFilterSurveyResult);
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

    setFilterSets({
      ...filterSets,
      [id]: {
        _id: id,
        name: `Filter Set #${id}`,
        pointColor: lightColor,
        pointShape: "trapeze",
        categories: [],
        visible: true,
        showModal: true,
        filters: {},
      },
    });
  };

  const changeFilterValue: any = (id: any, valueName: any, newValue: any) => {
    const newFilterSet = Object.values(filterSets).map((filterSet: any) =>
      filterSet._id === id ? { ...filterSet, [valueName]: newValue } : filterSet
    );

    setFilterSets({ ...newFilterSet });
  };

  if (isLoadingFilters) {
    return <LoadingData title="Loading filters" />;
  }

  console.log("sets", filterSets);

  const handleSave = (filterSetId: any, index: any) => {
    if (filterSetId) {
      updateMutation.mutate(filterSets[index]);
    } else {
      createMutation.mutate(filterSets[index]);
    }
  };

  return (
    <div className="survey-response__filters">
      <Button
        className="survey-response__finished__new-filter-button"
        onClick={createFilterSet}
      >
        Create new filter set
      </Button>
      {Object.values(filterSets)?.map((filterSet: any, index: any) => {
        return (
          <React.Fragment key={filterSet?._id}>
            <div className="survey-response__filters__item">
              <div className="survey-response__filters__item__icon">
                <ColoredShape
                  shape={filterSet?.pointShape}
                  color={filterSet?.pointColor}
                />
              </div>

              <span
                style={{ cursor: "pointer" }}
                onClick={() => {
                  changeFilterValue(
                    filterSet._id,
                    "showModal",
                    !filterSet.showModal
                  );
                }}
              >
                {filterSet?.name}
              </span>
              <Switch
                value={!!filterSet.visible}
                setValue={() => {
                  changeFilterValue(
                    filterSet._id,
                    "visible",
                    !filterSet.visible
                  );
                }}
              />

              <Button
                className="survey-response__filters__item__collapse"
                onClick={() => deleteMutation.mutate(filterSet._id)}
              >
                DELETE
              </Button>
            </div>
            <ResultsFilters
              currentFiltersValues={filterSet.filters}
              filterSet={filterSet}
              surveyId={surveyId}
              changeFilterValue={changeFilterValue}
              companyId={companyId}
              handleSave={handleSave}
              index={index}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default FiltersSets;
