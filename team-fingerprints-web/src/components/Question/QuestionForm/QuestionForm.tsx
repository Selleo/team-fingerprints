import { TextInput, Button, Switch } from "@mantine/core";
import { useFormik } from "formik";
import { useMutation } from "react-query";
import { useStyles } from "./styles";
import axios from "axios";
import { queryClient } from "../../../App";
import { Question } from "../../../types/models";
import { isEmpty } from "lodash";

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
  const isCreate = isEmpty(initialValues);
  const { classes } = useStyles();

  const onSuccess = () => {
    onClose();
    queryClient.invalidateQueries(["surveyOne"]);
  };

  const createMutation = useMutation(
    async (newQuestion: Partial<Question>) => {
      return axios.post(
        `/survey/${surveyId}/category/${categoryId}/trend/${trendId}/question`,
        newQuestion
      );
    },
    {
      onSuccess,
    }
  );

  const updateMutation = useMutation(
    async (question: Partial<Question>) => {
      return axios.patch(
        `/survey/${surveyId}/category/${categoryId}/trend/${trendId}/question/${question._id}`,
        question
      );
    },
    {
      onSuccess,
    }
  );

  const { handleSubmit, handleChange, values } = useFormik<Partial<Question>>({
    initialValues: initialValues || { title: "", primary: true },
    onSubmit: (val: Partial<Question>) =>
      isCreate ? createMutation.mutate(val) : updateMutation.mutate(val),
  });

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
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
        label="primary"
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