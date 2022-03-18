import { useEffect, useRef } from "react";
import { TextInput, Button } from "@mantine/core";
import { useFormik } from "formik";
import { useMutation } from "react-query";
import { useStyles } from "./styles";
import axios from "axios";
import { queryClient } from "../../../App";
import { Trend } from "../../../types/models";
import { isEmpty } from "lodash";
import useDefaultErrorHandler from "../../../hooks/useDefaultErrorHandler";

const TrendForm = ({
  surveyId,
  categoryId,
  onClose,
  initialValues,
}: {
  surveyId: string;
  onClose: () => void;
  categoryId: string;
  initialValues?: Trend;
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isCreate = isEmpty(initialValues);
  const { classes } = useStyles();
  const { onErrorWithTitle } = useDefaultErrorHandler();

  const onSuccess = () => {
    onClose();
    queryClient.invalidateQueries("surveyOne" + surveyId);
  };

  const updateMutation = useMutation(
    async (trend: Partial<Trend>) => {
      return axios.patch(
        `/surveys/${surveyId}/categories/${categoryId}/trends/${trend._id}`,
        trend
      );
    },
    {
      onSuccess,
      onError: onErrorWithTitle("Can not update trend"),
    }
  );

  const createMutation = useMutation(
    async (newTrend: Partial<Trend>) => {
      return axios.post(
        `/surveys/${surveyId}/categories/${categoryId}/trends`,
        newTrend
      );
    },
    {
      onSuccess,
      onError: onErrorWithTitle("Can not create trend"),
    }
  );

  const { handleSubmit, handleChange, values } = useFormik<Partial<Trend>>({
    initialValues: initialValues || { primary: "", secondary: "" },
    onSubmit: (val: Partial<Trend>) =>
      isCreate ? createMutation.mutate(val) : updateMutation.mutate(val),
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      inputRef && inputRef.current!.focus();
    }, 1);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        ref={inputRef}
        value={values.primary}
        required
        label="Trend primary"
        placeholder="Trend primary"
        onChange={handleChange("primary")}
      />

      <TextInput
        value={values.secondary}
        required
        label="Trend secondary"
        placeholder="Trend secondary"
        onChange={handleChange("secondary")}
      />

      <Button className={classes.submitButton} type="submit">
        {createMutation.isLoading || updateMutation.isLoading
          ? "Loading"
          : isCreate
          ? "Create"
          : "Update"}
      </Button>
    </form>
  );
};

export default TrendForm;
