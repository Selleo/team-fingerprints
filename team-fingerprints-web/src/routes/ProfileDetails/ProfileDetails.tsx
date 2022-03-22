import { useContext, useMemo } from "react";
import { useMutation, useQuery } from "react-query";
import { isArray, isEmpty, times, reduce, omitBy } from "lodash";
import { Select, Skeleton } from "@mantine/core";
import axios from "axios";
import { useFormik } from "formik";
import { ReactComponent as BGIcons } from "../../assets/BGIcons.svg";
import "./styles.sass";
import ErrorLoading from "../../components/ErrorLoading";
import { Filter } from "../../types/models";
import { ProfileContext } from "../../routes";
import useDefaultErrorHandler from "../../hooks/useDefaultErrorHandler";
import { useNotifications } from "@mantine/notifications";

type FormData = {
  [key: string]: string;
};

const ProfileDetails = () => {
  const { profile, invalidateProfile } = useContext(ProfileContext);
  const { showNotification } = useNotifications();
  const { onErrorWithTitle } = useDefaultErrorHandler();

  const { isLoading, error, data } = useQuery<Filter[]>(
    "filtersAll",
    async () => {
      const response = await axios.get<Filter[]>("/filters");
      return response.data;
    }
  );

  const updateMutation = useMutation(
    async (data: FormData) => {
      return axios.put(`/users/details`, data);
    },
    {
      onSuccess: () => {
        showNotification({
          color: "blue",
          title: "Success!",
          message: "Profile update is successful",
        });
        invalidateProfile();
      },
      onError: onErrorWithTitle("Can not create profile data"),
    }
  );

  const initialValues = reduce(
    data || [],
    (result: FormData, filter: Filter) => {
      const valueFromProfile = profile?.userDetails?.[filter.filterPath];
      result[filter.filterPath] = valueFromProfile || "";
      return result;
    },
    {} as FormData
  );

  const { handleSubmit, handleChange, values } = useFormik<FormData>({
    enableReinitialize: true,
    initialValues,
    onSubmit: (val) => {
      const valuesWithoutEmpites = omitBy(val, isEmpty);
      updateMutation.mutate(valuesWithoutEmpites);
    },
  });

  const content = useMemo(() => {
    if (isLoading)
      return (
        <>
          {times(3, () => (
            <Skeleton height={73} width={560} mt={6} radius="md" animate />
          ))}
        </>
      );

    if (error) return <ErrorLoading title="Can't load filters" />;

    return (
      isArray(data) &&
      (isEmpty(data) ? (
        <h3 className="profile__empty">No available filters</h3>
      ) : (
        <>
          <ul className="profile__details">
            {data?.map((item: Filter) => (
              <li className="profile__detail">
                <Select
                  classNames={{
                    root: "profile__detail__select",
                    label: "profile__detail__select__label",
                  }}
                  label={item.name.toUpperCase()}
                  placeholder="Pick one"
                  data={[
                    { value: "", label: "" },
                    ...item.values.map((value) => ({
                      value: value._id,
                      label: value.value,
                    })),
                  ]}
                  onChange={async (e: string) => {
                    await handleChange(item.filterPath)(e);
                    await handleSubmit();
                  }}
                  value={values[item.filterPath]}
                />
              </li>
            ))}
          </ul>
        </>
      ))
    );
  }, [data, error, isLoading, values]);

  return (
    <div className="profile">
      <h1 className="profile__headline">Your profile</h1>
      {content}
      <div className="svg-background">
        <BGIcons />
      </div>
    </div>
  );
};

export default ProfileDetails;
