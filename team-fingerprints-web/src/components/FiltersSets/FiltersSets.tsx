import axios from "axios";
import React, { useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import { uniqueId } from "lodash";
import { Button } from "@mantine/core";

import LoadingData from "../LoadingData";
import ResultsFilters from "./ResultsFilters";
import { getRandomLightColor } from "../../utils/utils";

import { FiltersSet, FilterSets, ChangeFilterValue } from "../../types/models";

import "./styles.sass";
import { queryClient } from "../../App";

type Props = {
  filterSets: FilterSets;
  setFilterSets: React.Dispatch<React.SetStateAction<FilterSets>>;
  apiUrl?: string;
  isPublic?: boolean;
};

const FiltersSets = ({
  filterSets,
  setFilterSets,
  apiUrl,
  isPublic,
}: Props) => {
  const { companyId, surveyId } = useParams();

  const {
    isLoading: isLoadingFilters,
    data: filtersData,
    refetch: refetchFilterSets,
  } = useQuery<any, Error>(
    ["filterSets", surveyId, companyId],
    async () => {
      const { data } = await axios.get<any>(
        `/filter-templates/${apiUrl}/filters`
      );
      return data;
    },
    { enabled: !isPublic, cacheTime: 0 }
  );

  useEffect(() => {
    if (!isPublic && filtersData) {
      const filtersDataResult = filtersData.reduce(
        (acc: FilterSets, filterSet: FiltersSet) => {
          acc[filterSet._id] = filterSet;
          return acc;
        },
        {}
      );
      setFilterSets(filtersDataResult);
    }
  }, [isPublic, filtersData]);

  const queryData = queryClient.getQueryData([
    "filterSets",
    surveyId,
    companyId,
  ]);

  const createMutation = useMutation(
    async (filtersSet: any) => {
      return axios.post(`/filter-templates/${apiUrl}/filters`, filtersSet);
    },
    {
      onSuccess: (data) => {
        setFilterSets({
          ...filterSets,
          [data.data._id]: data.data,
        });
      },
    }
  );

  const updateMutation = useMutation(async (filtersSet: FiltersSet) => {
    return axios.put(
      `/filter-templates/${apiUrl}/filters/${filtersSet._id}`,
      filtersSet
    );
  });

  const deleteMutation = useMutation(
    async (filterSet: { _id: string; index: number }) => {
      return axios.delete(
        `/filter-templates/${apiUrl}/filters/${filterSet._id}`
      );
    },
    {
      onSuccess: (data, filterSet) => {
        const newFilterSurveyResult = { ...filterSets };
        delete newFilterSurveyResult[filterSet.index];
        setFilterSets(newFilterSurveyResult);
      },
    }
  );

  const createFilterSet = () => {
    const lightColor = getRandomLightColor();

    const newFilterSet = {
      name: `Filter Set`,
      pointColor: lightColor,
      pointShape: "trapeze",
      categories: [],
      visible: true,
      showModal: false,
      filters: { country: "623ae947b92be5c33bfee380" },
      modalVisible: false,
    };

    if (!isPublic) {
      createMutation.mutate(newFilterSet);
    } else {
      const id = uniqueId();
      setFilterSets({
        ...filterSets,
        [id]: {
          _id: id,
          name: `Filter Set ${id}`,
          pointColor: lightColor,
          pointShape: "trapeze",
          categories: [],
          visible: true,
          showModal: false,
          filters: {},
        },
      });
    }
  };

  const updateFilterSet = (filterSetData: FiltersSet) => {
    setFilterSets((prevFilterSets: FilterSets) => {
      return { ...prevFilterSets, [filterSetData._id]: filterSetData };
    });
  };

  const changeFilterValue: any = (
    filterSetId: string,
    valueName: string,
    newValue: string
  ) => {
    const newFilterSet = {
      ...filterSets[filterSetId],
      [valueName]: newValue,
    };

    updateFilterSet(newFilterSet);
  };

  const handleSave = (filterSetData: any) => {
    if (filterSetData._id) {
      updateFilterSet(filterSetData);
      updateMutation.mutate(filterSetData);
    } else {
      createMutation.mutate(filterSetData);
    }
  };

  const handleDelete = (filterSet: FiltersSet, index: number) => {
    if (!isPublic) {
      deleteMutation.mutate({ _id: filterSet._id, index: index });
    } else {
      const newFilterSurveyResult = { ...filterSets };
      delete newFilterSurveyResult[index];
      setFilterSets(newFilterSurveyResult);
    }
  };

  const handleVisible = (filterSet: FiltersSet) => {
    changeFilterValue(filterSet._id, "visible", !filterSet.visible);
    if (!isPublic) {
      updateMutation.mutate(
        {
          ...filterSet,
          visible: !filterSet.visible,
        },
        {
          onError: () => {
            changeFilterValue(filterSet._id, "visible", filterSet.visible);
          },
        }
      );
    }
  };

  if (!isPublic) {
    if (isLoadingFilters) {
      return <LoadingData title="Loading filters" />;
    }
  }

  return (
    <div className="filters">
      {Object.values<FiltersSet>(filterSets)?.map((filterSet, index) => (
        <ResultsFilters
          currentFiltersValues={filterSet.filters}
          filterSet={filterSet}
          changeFilterValue={changeFilterValue}
          handleSave={handleSave}
          index={index}
          handleDelete={handleDelete}
          apiUrl={apiUrl}
          isPublic={isPublic}
          handleVisible={handleVisible}
        />
      ))}
      <Button className="filters__new" onClick={createFilterSet}>
        Add new filterset
      </Button>
    </div>
  );
};

export default FiltersSets;
