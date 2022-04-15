import { useMemo, memo } from "react";
import { Select } from "@mantine/core";
import { FilterSelect } from "../../../../types/models";

type Props = {
  filter: FilterSelect;
  values: Values;
  handleChange: (e: string) => any;
  handleSubmit: () => void;
};

type Values = {
  _id: string,
  value: string,
  label: string
}

const selectClasses = {
  root: "survey-response__filters__select",
  label: "survey-response__filters__select__label",
};

const MemoizedSelect = memo(Select);

const FiltersSelect = ({
  filter,
  handleChange,
  handleSubmit,
}: Props) => {
  const itemSelect = useMemo(() => {
    const data = [
      { value: "", label: "" },
      ...filter.values?.map((value: Values) => ({
        value: value._id,
        label: value.value,
      })),
    ];

    return data;
  }, [filter]);

  return (
    <MemoizedSelect
      classNames={selectClasses}
      key={filter._id}
      label={filter.name}
      placeholder="Pick one"
      data={itemSelect}
      onChange={(e) => {
        handleChange(filter.filterPath)(e);
        handleSubmit();
      }}
    />
  );
};

export default FiltersSelect;
