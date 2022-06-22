import axios from "axios";
import { useEffect, useRef } from "react";
import { TextInput, Button } from "@mantine/core";
import { useFormik } from "formik";
import { useMutation } from "react-query";
import { isEmpty } from "lodash";

import { queryClient } from "App";
import { Category } from "types/models";
import useDefaultErrorHandler from "hooks/useDefaultErrorHandler";

import "./styles.sass";

const CategoryForm = ({
  surveyId,
  onClose,
  initialValues,
}: {
  surveyId: string;
  onClose: () => void;
  initialValues?: Category;
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isCreate = isEmpty(initialValues);
  const { onErrorWithTitle } = useDefaultErrorHandler();

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
      onError: onErrorWithTitle("Can not create category"),
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
      onError: onErrorWithTitle("Can not update category"),
    }
  );

  const { handleSubmit, handleChange, values } = useFormik<Partial<Category>>({
    initialValues: initialValues || { title: "" },
    onSubmit: (val: Partial<Category>) =>
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
        value={values.title}
        required
        label="Category title"
        placeholder="Category name"
        onChange={handleChange("title")}
      />

      <Button className="submitButton" type="submit">
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
