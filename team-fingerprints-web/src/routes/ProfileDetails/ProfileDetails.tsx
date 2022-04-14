import { useContext, useMemo } from "react";
import { useMutation, useQuery } from "react-query";
import { isEmpty, times, reduce, omitBy } from "lodash";
import { useNotifications } from "@mantine/notifications";
import { Skeleton } from "@mantine/core";
import { useFormik } from "formik";
import axios from "axios";

import ProfileSelect from "./ProfileSelect";
import useDefaultErrorHandler from "../../hooks/useDefaultErrorHandler";
import ErrorLoading from "../../components/ErrorLoading";
import { FormData } from "../../types/models";
import { ReactComponent as BGIcons } from "../../assets/BGIcons.svg";
import { Filter } from "../../types/models";
import { ProfileContext } from "../../routes";

import "./styles.sass";

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
      return axios.post(`/users/details`, data);
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
    onSubmit: (values) => {
      const valuesWithoutEmpties = omitBy(values, isEmpty);
      updateMutation.mutate(valuesWithoutEmpties);
    },
  });

  const content = useMemo(() => {
    if (isLoading)
      return (
        <>
          {times(3, (index: number) => (
            <Skeleton
              key={index}
              height={73}
              width={560}
              mt={6}
              radius="md"
              animate
            />
          ))}
        </>
      );

    if (error) return <ErrorLoading title="Can't load filters" />;

    if (!data || isEmpty(data))
      return <h3 className="profile__empty">No available filters</h3>;

    return (
      <ul className="profile__details">
        {data.map((item: Filter) => (
          <ProfileSelect
            item={item}
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            values={values}
          />
        ))}
      </ul>
    );
  }, [data, error, isLoading, values, handleSubmit, handleChange]);

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
