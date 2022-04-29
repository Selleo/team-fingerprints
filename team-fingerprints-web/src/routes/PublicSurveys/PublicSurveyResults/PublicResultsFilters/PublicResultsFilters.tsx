import axios from "axios";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { isEmpty, omitBy, values as lodashValues } from "lodash";
import { useFormik } from "formik";
import { ColorPicker, Select } from "@mantine/core";

import FiltersSelect from "./FiltersSelect";
import {
  FilterSelect,
  Shape,
  ChangeFilterValue,
  FilterSets,
} from "../../../../types/models";

type Props = {
  id: string;
  currentFiltersValues: { [key: string]: Array<string> };
  surveyId: string;
  changeFilterValue: ChangeFilterValue;
};

const PublicResultsFilters = ({
  currentFiltersValues,
  surveyId,
  changeFilterValue,
  id,
}: Props) => {
  const { handleSubmit, setFieldValue } = useFormik({
    enableReinitialize: true,
    initialValues: currentFiltersValues,
    onSubmit: (values) => {
      const valuesWithoutEmpties = omitBy(values, isEmpty);
      changeFilterValue(id, "filterValues", valuesWithoutEmpties);
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

  const { data: availableFilters } = useQuery<any, Error>(
    ["surveyFiltersPublic", surveyId],
    async () => {
      const { data } = await axios.get<FilterSets>(
        `/survey-filters/${surveyId}/companies`
      );
      return data;
    }
  );

  useEffect(() => {
    const categoriesArray = lodashValues(surveyResult);
    changeFilterValue(id, "categories", categoriesArray);
  }, [surveyResult]);

  return (
    <div className="survey-response__selects">
      <Select
        label="Shape"
        placeholder="Pick one"
        data={[
          { value: "triangle", label: "Triangle" },
          { value: "square", label: "Square" },
          { value: "circle", label: "Circle" },
          { value: "trapeze", label: "Trapeze" },
        ]}
        onChange={(e: Shape) => changeFilterValue(id, "icon", e)}
      />
      <label className="survey-response__selects__shapes-label">
        Shape's color
      </label>
      <ColorPicker
        format="hex"
        onChange={(e) => {
          changeFilterValue(id, "color", e);
        }}
        size="md"
      />
      {availableFilters?.map((filter: FilterSelect) => (
        <FiltersSelect
          key={filter._id}
          filter={filter}
          handleSubmit={handleSubmit}
          setFieldValue={setFieldValue}
        />
      ))}
    </div>
  );
};

export default PublicResultsFilters;
