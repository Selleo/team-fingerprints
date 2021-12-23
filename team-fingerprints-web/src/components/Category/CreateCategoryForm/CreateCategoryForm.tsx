import { TextInput, Button } from "@mantine/core";
import { useFormik } from "formik";
import { useMutation } from "react-query";
import { useStyles } from "./styles";
import axios from "axios";
import { queryClient } from "../../../App";
import { Category } from "../../../types/models";

const CreateCategoryForm = ({
  surveyId,
  onClose,
}: {
  surveyId: string;
  onClose: () => void;
}) => {
  const { classes } = useStyles();

  const mutation = useMutation(
    async (newCategory: Partial<Category>) => {
      return axios.post(`/survey/${surveyId}/category`, newCategory);
    },
    {
      onSuccess: () => {
        onClose();
        queryClient.invalidateQueries(["surveyOne"]);
      },
    }
  );

  const { handleSubmit, handleChange } = useFormik<Partial<Category>>({
    initialValues: { title: "" },
    onSubmit: (val: Partial<Category>) => mutation.mutate(val),
  });

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        required
        label="Category title"
        placeholder="Category name"
        onChange={handleChange("title")}
      />

      <Button className={classes.submitButton} type="submit">
        {mutation.isLoading ? "Loading" : "Create"}
      </Button>
    </form>
  );
};

export default CreateCategoryForm;
