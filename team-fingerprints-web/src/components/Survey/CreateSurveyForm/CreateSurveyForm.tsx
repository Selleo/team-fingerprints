import { TextInput, Button } from "@mantine/core";
import { useFormik } from "formik";
import { useMutation } from "react-query";
import { useStyles } from "./styles";
import axios from "axios";
import { queryClient } from "../../../App";
import { Survey } from "../../../types/models";

const CreateSurveyForm = ({ onClose }: { onClose: () => void }) => {
  const { classes } = useStyles();

  const mutation = useMutation(
    (newSurvey: Partial<Survey>) => {
      return axios.post<Partial<Survey>>("/survey", newSurvey).then(onClose);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["surveysAll"]);
      },
    }
  );

  const { handleSubmit, handleChange } = useFormik<Partial<Survey>>({
    initialValues: { title: "" },
    onSubmit: (val) => mutation.mutate(val),
  });

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        required
        label="Survey title"
        placeholder="Survey name"
        onChange={handleChange("title")}
      />

      <Button className={classes.submitButton} type="submit">
        {mutation.isLoading ? "Loading" : "Create"}
      </Button>
    </form>
  );
};

export default CreateSurveyForm;
