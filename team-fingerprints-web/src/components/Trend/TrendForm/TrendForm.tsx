import { TextInput, Button } from "@mantine/core";
import { useFormik } from "formik";
import { useMutation } from "react-query";
import { useStyles } from "./styles";
import axios from "axios";
import { queryClient } from "../../../App";
import { Trend } from "../../../types/models";
import { isEmpty } from "lodash";

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
  const isCreate = isEmpty(initialValues);
  const { classes } = useStyles();

  const onSuccess = () => {
    onClose();
    queryClient.invalidateQueries(["surveyOne"]);
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
    }
  );

  const { handleSubmit, handleChange, values } = useFormik<Partial<Trend>>({
    initialValues: initialValues || { primary: "", secondary: "" },
    onSubmit: (val: Partial<Trend>) =>
      isCreate ? createMutation.mutate(val) : updateMutation.mutate(val),
  });

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
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
