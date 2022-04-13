import { useQuery } from "react-query";
import axios from "axios";
import { isEmpty, times, reduce, omitBy } from "lodash";
import { useFormik } from "formik";
import FiltersSelect from "./FiltersSelect";
import { FilterSelect } from "../../../../types/models";
import { Loader } from "@mantine/core";
import { Filter } from "../../../../types/models";
import "./styles.sass";

type Props = {
  setFilterValues: any;
};

const ResultsFilters = ({ setFilterValues }: Props) => {
  const { isLoading: isLoadingFiltersFinished, data: surveyFilters } = useQuery<
    any,
    Error
  >(["surveyFilters"], async () => {
    const { data } = await axios.get<any>(`/survey-results/companies/filters`);
    return data;
  });

  const initialValues = {};

  const { handleSubmit, handleChange, values } = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit: (values) => {
      const valuesWithoutEmpties = omitBy(values, isEmpty);
      setFilterValues(valuesWithoutEmpties);
    },
  });

  if (isLoadingFiltersFinished) {
    return (
      <div className="filters-loading">
        <Loader />
      </div>
    );
  }

  return (
    <div className="survey-response__filters">
      <h3>Filters</h3>
      {surveyFilters?.map((filter: FilterSelect) => (
        <FiltersSelect
          key={filter._id}
          filter={filter}
          values={values}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      ))}
    </div>
  );
};

export default ResultsFilters;
