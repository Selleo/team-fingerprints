import { Select } from "@mantine/core";
import { useCallback, useMemo } from "react";
import { ProfileSelectorProp } from "../../types/models";

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
      <Select
        classNames={{
          root: "profile__detail__select",
          label: "profile__detail__select__label",
        }}
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
