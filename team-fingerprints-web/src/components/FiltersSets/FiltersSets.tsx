import axios from "axios";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import { uniqueId } from "lodash";
import { Button } from "@mantine/core";

import LoadingData from "../LoadingData";
import ResultsFilters from "./ResultsFilters";
import { getRandomLightColor } from "utils/utils";
import { FiltersSet, FilterSets, ChangeFilterValue } from "../../types/models";

import "./styles.sass";

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

  const { isLoading: isLoadingFilters, data: filtersData } = useQuery<
    any,
    Error
  >(
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
    async (filterSet: FiltersSet) => {
      return axios.delete(
        `/filter-templates/${apiUrl}/filters/${filterSet._id}`
      );
    },
    {
      onSuccess: (data, filterSet) => {
        const newFilterSurveyResult = { ...filterSets };
        delete newFilterSurveyResult[filterSet._id];
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
      filters: { country: ["623ae947b92be5c33bfee380"] },
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

  const changeFilterValue: ChangeFilterValue = (
    filterSetId,
    valueName,
    newValue
  ) => {
    const newFilterSet = {
      ...filterSets[filterSetId],
      [valueName]: newValue,
    };

    updateFilterSet(newFilterSet);
  };

  const handleSave = (filterSetData: FiltersSet) => {
    if (!isPublic) {
      updateMutation.mutate(filterSetData);
    }
    updateFilterSet(filterSetData);
  };

  const handleDelete = (filterSet: FiltersSet) => {
    if (!isPublic) {
      deleteMutation.mutate(filterSet);
    } else {
      const newFilterSurveyResult = { ...filterSets };
      delete newFilterSurveyResult[filterSet._id];
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
      {Object.values<FiltersSet>(filterSets)?.map((filterSet) => (
        <ResultsFilters
          currentFiltersValues={filterSet.filters}
          filterSet={filterSet}
          changeFilterValue={changeFilterValue}
          handleSave={handleSave}
          handleDelete={handleDelete}
          apiUrl={apiUrl}
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
