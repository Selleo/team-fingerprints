import { Select } from "@mantine/core";
import { useCallback, useMemo, memo } from "react";
import { ProfileSelectorProp } from "../../types/models";

const classes = {
  root: "profile__detail__select",
  label: "profile__detail__select__label",
};

const MemoizedSelect = memo(Select);

const ProfileSelect = (props: ProfileSelectorProp) => {
  const { item, handleChange, handleSubmit, values } = props;

  const itemSelect = useMemo(() => {
    const data = [
      { value: "", label: "" },
      ...item.values?.map((value) => ({
        value: value._id,
        label: value.value,
      })),
    ];

    return data;
  }, [item]);

  const onChangeCallback = useCallback(
    async (e) => {
      await handleChange(item.filterPath)(e);
      await handleSubmit();
    },
    [item.filterPath, handleChange, handleSubmit]
  );

  return (
    <li className="profile__detail">
      <MemoizedSelect
        classNames={classes}
        label={item.name}
        placeholder="Pick one"
        data={itemSelect}
        onChange={onChangeCallback}
        value={values[item.filterPath]}
      />
    </li>
  );
};

export default ProfileSelect;
