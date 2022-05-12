import axios from "axios";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { isEmpty, omitBy, values as lodashValues } from "lodash";
import { useFormik } from "formik";
import { ColorPicker, Select } from "@mantine/core";

import FiltersSelect from "./FiltersSelect";
import { FilterSelect, Shape, FilterSets } from "../../../../../types/models";

type Props = {
  filterSet: any;
  currentFiltersValues: { [key: string]: Array<string> };
  surveyId: string;
  changeFilterValue: any;
  setFilterSurveyResults: any;
  filterSurveyResults: any;
};

const ResultsFilters = ({
  currentFiltersValues,
  surveyId,
  changeFilterValue,
  filterSet,
  setFilterSurveyResults,
  filterSurveyResults,
}: Props) => {
  const { handleSubmit, setFieldValue } = useFormik({
    enableReinitialize: true,
    initialValues: currentFiltersValues,
    onSubmit: (values) => {
      const valuesWithoutEmpties = omitBy(values, isEmpty);
      changeFilterValue({ ...filterSet, filters: valuesWithoutEmpties });
    },
  });

  const { data: surveyResult } = useQuery<any, Error>(
    ["publicSurvey", surveyId, currentFiltersValues],
    async () => {
      const { data } = await axios.get<any>(
        `/survey-results/${surveyId}/companies`,
        { params: currentFiltersValues }
      );
      return data;
    }
  );

  useEffect(() => {
    const categoriesArray = lodashValues(surveyResult);
    setFilterSurveyResults({
      ...filterSurveyResults,
      [filterSet._id]: {
        id: filterSet._id,
        categories: categoriesArray,
        color: filterSet.pointColor,
        icon: filterSet.pointShape,
        visible: filterSet.visible,
      },
    });
  }, [surveyResult, filterSet]);

  const { data: availableFilters } = useQuery<any, Error>(
    ["surveyFiltersPublic", surveyId],
    async () => {
      const { data } = await axios.get<FilterSets>(
        `/survey-filters/${surveyId}/companies`
      );
      return data;
    }
  );

  return (
    <div className="survey-response__selects">
      <Select
        label="Shape"
        placeholder="Pick one"
        value={filterSet.pointShape}
        data={[
          { value: "triangle", label: "Triangle" },
          { value: "square", label: "Square" },
          { value: "circle", label: "Circle" },
          { value: "trapeze", label: "Trapeze" },
        ]}
        onChange={(e: Shape) =>
          changeFilterValue({ ...filterSet, pointShape: e })
        }
      />
      <label className="survey-response__selects__shapes-label">
        Shape's color
      </label>
      <ColorPicker
        format="hex"
        value={filterSet.pointColor}
        onChange={(e) => {
          changeFilterValue({ ...filterSet, pointColor: e });
        }}
        size="md"
      />
      {availableFilters?.map((filter: FilterSelect) => (
        <FiltersSelect
          key={filter._id}
          filter={filter}
          handleSubmit={handleSubmit}
          setFieldValue={setFieldValue}
          filterSet={filterSet}
        />
      ))}
    </div>
  );
};

export default ResultsFilters;
