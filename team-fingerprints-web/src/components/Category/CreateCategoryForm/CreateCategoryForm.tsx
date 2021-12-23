import { TextInput, Button } from "@mantine/core";
import { useFormik } from "formik";
import { useMutation } from "react-query";
import { useStyles } from "./styles";
import axios from "axios";
import { queryClient } from "../../../App";

const CreateCategoryForm = ({
  surveyId,
  onClose,
}: {
  surveyId: string;
  onClose: () => void;
}) => {
  const { classes } = useStyles();

  const mutation = useMutation(
    (newCategory) => {
      return axios
        .post(`/survey/${surveyId}/category`, newCategory)
        .then(onClose)
        .catch(console.warn);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["surveyOne"]);
      },
    }
  );

  const onSubmit = (data: any) => {
    mutation.mutate(data);
  };

  const { handleSubmit, handleChange } = useFormik({
    initialValues: { data: { title: "" } },
    onSubmit,
  });

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        required
        label="Category title"
        placeholder="Category name"
        onChange={handleChange("data.title")}
      />

      <Button className={classes.submitButton} type="submit">
        {mutation.isLoading ? "Loading" : "Create"}
      </Button>
    </form>
  );
};

export default CreateCategoryForm;