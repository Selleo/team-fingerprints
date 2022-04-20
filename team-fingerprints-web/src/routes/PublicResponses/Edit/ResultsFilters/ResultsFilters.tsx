import axios from "axios";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { isEmpty, omitBy, values as lodashValues } from "lodash";
import { useFormik } from "formik";
import { ColorPicker, Select } from "@mantine/core";

import FiltersSelect from "./FiltersSelect";
import { CategoryResults, FilterSelect, Shape } from "../../../../types/models";

type Props = {
  setFilterValues: (filters: { index?: string; value?: Array<string> }) => void;
  id: string;
  availableFilters: [
    {
      filterPath: string;
      name: string;
      values: [
        {
          value: string;
          _id: string;
        }
      ];
      _id: string;
    }
  ];
  currentFiltersValues: {
    index?: string;
    value?: Array<string>;
  };
  surveyId: string;
  setFilterResults: (newFilterResults: CategoryResults[]) => void;
  setFilterShape: (newShape: Shape) => void;
  setFilterColor: (newColor: string) => void;
};

const ResultsFilters = ({
  setFilterValues,
  id,
  availableFilters,
  currentFiltersValues,
  surveyId,
  setFilterResults,
  setFilterShape,
  setFilterColor,
}: Props) => {
  const { handleSubmit, setFieldValue } = useFormik({
    enableReinitialize: true,
    initialValues: currentFiltersValues,
    onSubmit: (values) => {
      const valuesWithoutEmpties = omitBy(values, isEmpty);
      setFilterValues(valuesWithoutEmpties);
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
    setFilterResults(categoriesArray);
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
        onChange={(e: Shape) => setFilterShape(e)}
      />
      <label className="survey-response__selects__shapes-label">
        Shape's color
      </label>
      <ColorPicker
        format="hex"
        onChange={(e) => {
          setFilterColor(e);
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

export default ResultsFilters;
