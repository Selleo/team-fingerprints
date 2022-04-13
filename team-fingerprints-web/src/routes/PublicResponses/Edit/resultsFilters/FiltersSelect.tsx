import { Select } from "@mantine/core";
import { FilterSelect } from "../../../../types/models";
import { useCallback, useMemo, memo } from "react";

type Props = {
  filter: FilterSelect;
  values: any;
  handleChange: any;
  handleSubmit: any;
};

const selectClasses = {
  root: "survey-response__filters__select",
  label: "survey-response__filters__select__label",
};

const MemoizedSelect = memo(Select);

const FiltersSelect = ({
  filter,
  values,
  handleChange,
  handleSubmit,
}: Props) => {
  const itemSelect = useMemo(() => {
    const data = [
      { value: "", label: "" },
      ...filter.values?.map((value: any) => ({
        value: value._id,
        label: value.value,
      })),
    ];

    return data;
  }, [filter]);

  return (
    <>
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
    </>
  );
};

export default FiltersSelect;
