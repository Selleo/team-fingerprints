import { useMemo } from "react";
import { MultiSelect } from "@mantine/core";
import { FilterSelect, FiltersSet } from "types/models";

import "./styles.sass";

type Props = {
  filter: FilterSelect;
  handleSubmit: () => void;
  setFieldValue: (filterPath: string, value: Array<string>) => void;
  filterSet: FiltersSet;
};

type Values = {
  _id: string;
  value: string;
  label: string;
};

const selectClasses = {
  root: "filters__filter",
  label: "filters__filter-label",
  input: "filters__filter-input",
  dropdown: "filters__filter-dropdown",
  value: "filters__filter-value",
  values: "filters__filter-values",
  searchInput: "filters__filter-placeholder",
};

const FiltersSelect = ({
  filter,
  handleSubmit,
  setFieldValue,
  filterSet,
}: Props) => {
  const itemSelect = useMemo(() => {
    const data = [
      ...filter.values?.map((value: Values) => ({
        value: value._id,
        label: value.value,
      })),
    ];

    return data;
  }, [filter]);

  return (
    <MultiSelect
      classNames={selectClasses}
      key={filter._id}
      label={filterSet?.filters[filter.filterPath] && filter.name}
      placeholder={filter.name}
      searchable
      clearable
      value={filterSet?.filters[filter.filterPath]}
      data={itemSelect}
      onChange={(values) => {
        setFieldValue(filter.filterPath, values);
        handleSubmit();
      }}
    />
  );
};

export default FiltersSelect;
