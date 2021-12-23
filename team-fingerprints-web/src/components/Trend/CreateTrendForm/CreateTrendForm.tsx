import { TextInput, Button } from "@mantine/core";
import { useFormik } from "formik";
import { useMutation } from "react-query";
import { useStyles } from "./styles";
import axios from "axios";
import { queryClient } from "../../../App";
import { Trend } from "../../../types/models";

const CreateTrendForm = ({
  surveyId,
  categoryId,
  onClose,
}: {
  surveyId: string;
  onClose: () => void;
  categoryId: string;
}) => {
  const { classes } = useStyles();

  const mutation = useMutation(
    async (newTrend: Partial<Trend>) => {
      return axios.post(
        `/survey/${surveyId}/category/${categoryId}/trend`,
        newTrend
      );
    },
    {
      onSuccess: () => {
        onClose();
        queryClient.invalidateQueries(["surveyOne"]);
      },
    }
  );

  const { handleSubmit, handleChange } = useFormik<Partial<Trend>>({
    initialValues: { primary: "", secondary: "" },
    onSubmit: (val: Partial<Trend>) => mutation.mutate(val),
  });

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        required
        label="Trend primary"
        placeholder="Trend primary"
        onChange={handleChange("primary")}
      />

      <TextInput
        required
        label="Trend secondary"
        placeholder="Trend secondary"
        onChange={handleChange("secondary")}
      />

      <Button className={classes.submitButton} type="submit">
        {mutation.isLoading ? "Loading" : "Create"}
      </Button>
    </form>
  );
};

export default CreateTrendForm;
