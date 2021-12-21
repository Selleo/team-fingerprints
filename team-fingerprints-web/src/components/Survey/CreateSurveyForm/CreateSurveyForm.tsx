import { TextInput, Button } from "@mantine/core";
import { useFormik } from "formik";
import { useMutation } from "react-query";
import { useStyles } from "./styles";
import axios from "axios";
import { queryClient } from "../../../App";

const CreateSurveyForm = ({ onClose }: { onClose: () => void }) => {
  const { classes } = useStyles();

  const mutation = useMutation(
    (newSurvey) => {
      return axios.post("/survey", newSurvey).then(onClose);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["surveysAll"]);
      },
    }
  );

  const onSubmit = (values: any) => {
    mutation.mutate(values);
  };

  const { handleSubmit, handleChange } = useFormik({
    initialValues: { values: { title: "" } },
    onSubmit,
  });

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        required
        label="Survey title"
        placeholder="Survey name"
        onChange={handleChange("values.title")}
      />

      <Button className={classes.submitButton} type="submit">
        {mutation.isLoading ? "Loading" : "Create"}
      </Button>
    </form>
  );
};

export default CreateSurveyForm;
