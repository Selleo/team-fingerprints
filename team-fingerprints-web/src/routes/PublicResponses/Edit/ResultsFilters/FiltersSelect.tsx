import { useMemo } from "react";
import { MultiSelect } from "@mantine/core";
import { FilterSelect } from "../../../../types/models";

import "./styles.sass";

type Props = {
  filter: FilterSelect;
  handleSubmit: () => void;
  setFieldValue: (filterPath: string, value: Array<string>) => void;
};

type Values = {
  _id: string;
  value: string;
  label: string;
};

const selectClasses = {
  root: "survey-response__selects__item",
  label: "survey-response__selects__item__label",
};

const FiltersSelect = ({ filter, handleSubmit, setFieldValue }: Props) => {
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
      label={filter.name}
      placeholder="Select"
      searchable
      clearable
      data={itemSelect}
      onChange={(values) => {
        setFieldValue(filter.filterPath, values);
        handleSubmit();
      }}
    />
  );
};

export default FiltersSelect;
