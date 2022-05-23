import axios from "axios";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import { uniqueId } from "lodash";
import { Button } from "@mantine/core";

import LoadingData from "../LoadingData";
import ResultsFilters from "./ResultsFilters";
import ColoredShape from "../ColoredShape";

import { Switch } from "../Switch";
import { FiltersSet, FilterSets, ChangeFilterValue } from "../../types/models";

import "./styles.sass";

type Props = {
  filterSets: FilterSets;
  setFilterSets: (filtersData: any) => void;
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
      return { ...data };
    },
    { enabled: !isPublic }
  );

  useEffect(() => {
    if (!isPublic) {
      setFilterSets({ ...filtersData });
    }
  }, [filtersData]);

  const createMutation = useMutation(
    async (filtersSet: any) => {
      return axios.post(`/filter-templates/${apiUrl}/filters`, filtersSet);
    },
    {
      onSuccess: (data) => {
        const id = uniqueId("0");

        setFilterSets({
          ...filterSets,
          [id]: data.data,
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
      const newFilterSurveyResult = { ...filterSets };
      delete newFilterSurveyResult[filterSet.index];
      setFilterSets(newFilterSurveyResult);
      return axios.delete(
        `/filter-templates/${apiUrl}/filters/${filterSet._id}`
      );
    }
  );

  const createFilterSet = () => {
    const lightColor = "hsl(" + Math.floor(Math.random() * 361) + ",50%,75%)";

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
          filters: { country: "623ae947b92be5c33bfee380" },
          modalVisible: false,
        },
      });
    }
  };

  const changeFilterValue: ChangeFilterValue = (
    filterSetId,
    valueName,
    newValue
  ) => {
    setFilterSets((prevFilterSets: FiltersSet) => {
      const newFilterSet = Object.values(prevFilterSets).map((filterSet: any) =>
        filterSet._id === filterSetId
          ? { ...filterSet, [valueName]: newValue }
          : filterSet
      );
      return newFilterSet;
    });
  };

  if (!isPublic) {
    if (isLoadingFilters) {
      return <LoadingData title="Loading filters" />;
    }
  }

  const handleSave = (filterSetId: string, index: number) => {
    if (filterSetId) {
      updateMutation.mutate(filterSets[index]);
    } else {
      createMutation.mutate(filterSets[index]);
    }
  };

  return (
    <div className="filters">
      {Object.values<FiltersSet>(filterSets)?.map((filterSet, index) => {
        return (
          <React.Fragment key={index}>
            <div className="filters__item">
              <div className="filters__icon">
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
                  if (!isPublic) {
                    updateMutation.mutate(
                      {
                        ...filterSet,
                        visible: !filterSet.visible,
                      },
                      {
                        onError: () => {
                          changeFilterValue(
                            filterSet._id,
                            "visible",
                            filterSet.visible
                          );
                        },
                      }
                    );
                  }
                }}
              />
            </div>
            <ResultsFilters
              currentFiltersValues={filterSet.filters}
              filterSet={filterSet}
              changeFilterValue={changeFilterValue}
              handleSave={handleSave}
              index={index}
              deleteMutation={deleteMutation}
              apiUrl={apiUrl}
              isPublic={isPublic}
            />
          </React.Fragment>
        );
      })}
      <Button className="filters__new" onClick={createFilterSet}>
        Add new filterset
      </Button>
    </div>
  );
};

export default FiltersSets;
