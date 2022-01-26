import { TextInput, Button } from "@mantine/core";
import { useFormik } from "formik";
import { useMutation } from "react-query";
import { useStyles } from "./styles";
import axios from "axios";
import { queryClient } from "../../../App";
import { Category } from "../../../types/models";
import { isEmpty } from "lodash";

const CategoryForm = ({
  surveyId,
  onClose,
  initialValues,
}: {
  surveyId: string;
  onClose: () => void;
  initialValues?: Category;
}) => {
  const isCreate = isEmpty(initialValues);
  const { classes } = useStyles();

  const onSuccess = () => {
    onClose();
    queryClient.invalidateQueries("surveyOne" + surveyId);
  };

  const createMutation = useMutation(
    async (newCategory: Partial<Category>) => {
      return axios.post(`/surveys/${surveyId}/categories`, newCategory);
    },
    {
      onSuccess,
    }
  );

  const updateMutation = useMutation(
    async (category: Partial<Category>) => {
      return axios.patch(
        `/surveys/${surveyId}/categories/${category._id}`,
        category
      );
    },
    {
      onSuccess,
    }
  );

  const { handleSubmit, handleChange, values } = useFormik<Partial<Category>>({
    initialValues: initialValues || { title: "" },
    onSubmit: (val: Partial<Category>) =>
      isCreate ? createMutation.mutate(val) : updateMutation.mutate(val),
  });

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        value={values.title}
        required
        label="Category title"
        placeholder="Category name"
        onChange={handleChange("title")}
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

export default CategoryForm;
