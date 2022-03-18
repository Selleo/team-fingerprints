import { useEffect, useRef } from "react";
import { TextInput, Button, Switch } from "@mantine/core";
import { useFormik } from "formik";
import { useMutation } from "react-query";
import { useStyles } from "./styles";
import axios from "axios";
import { queryClient } from "../../../App";
import { Question } from "../../../types/models";
import { isEmpty } from "lodash";
import useDefaultErrorHandler from "../../../hooks/useDefaultErrorHandler";

const CreateQuestionForm = ({
  surveyId,
  categoryId,
  trendId,
  onClose,
  initialValues,
}: {
  surveyId: string;
  onClose: () => void;
  categoryId: string;
  trendId: string;
  initialValues?: Question;
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isCreate = isEmpty(initialValues);
  const { classes } = useStyles();
  const { onErrorWithTitle } = useDefaultErrorHandler();

  const onSuccess = () => {
    onClose();
    queryClient.invalidateQueries("surveyOne" + surveyId);
  };

  const createMutation = useMutation(
    async (newQuestion: Partial<Question>) => {
      return axios.post(
        `/surveys/${surveyId}/categories/${categoryId}/trends/${trendId}/questions`,
        newQuestion
      );
    },
    {
      onSuccess,
      onError: onErrorWithTitle("Can not create question"),
    }
  );

  const updateMutation = useMutation(
    async (question: Partial<Question>) => {
      return axios.patch(
        `/surveys/${surveyId}/categories/${categoryId}/trends/${trendId}/questions/${question._id}`,
        question
      );
    },
    {
      onSuccess,
      onError: onErrorWithTitle("Can not update question"),
    }
  );

  const { handleSubmit, handleChange, values } = useFormik<Partial<Question>>({
    initialValues: initialValues || { title: "", primary: true },
    onSubmit: (val: Partial<Question>) =>
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
        label="Question content"
        placeholder="Question content"
        onChange={handleChange("title")}
      />

      <Switch
        style={{ marginTop: "10px" }}
        checked={values.primary}
        onChange={(event) => {
          handleChange("primary")(event);
        }}
        label={`Positive answer to question indicade aswer ${
          values.primary ? "primary" : "secondary"
        }`}
      ></Switch>

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

export default CreateQuestionForm;
