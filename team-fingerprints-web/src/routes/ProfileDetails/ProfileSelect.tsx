import { Select } from "@mantine/core";
import { useCallback, useMemo, memo } from "react";
import { ProfileSelectorProp } from "types/models";

const classes = {
  input: "profile__select",
  label: "profile__select--label",
  dropdown: "profile__select--dropdown",
  root: "profile__select--root",
};

const MemoizedSelect = memo(Select);

const ProfileSelect = (props: ProfileSelectorProp) => {
  const { item, setFieldValue, handleSubmit, values } = props;

  const itemSelect = useMemo(() => {
    const data = [
      ...item.values?.map((value) => ({
        value: value._id,
        label: value.value,
      })),
    ];

    return data;
  }, [item]);

  const onChangeCallback = useCallback(
    async (e) => {
      await setFieldValue(item.filterPath, e);
      await handleSubmit();
    },
    [item.filterPath, setFieldValue, handleSubmit]
  );

  return (
    <li className="profile__detail">
      <MemoizedSelect
        searchable={item.filterPath === "country"}
        classNames={classes}
        label={values[item.filterPath] && item.name}
        placeholder={item.name}
        data={itemSelect}
        onChange={onChangeCallback}
        value={values[item.filterPath]}
      />
    </li>
  );
};

export default ProfileSelect;
