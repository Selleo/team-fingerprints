import { TextInput, Button, Switch } from "@mantine/core";
import { useFormik } from "formik";
import { useMutation } from "react-query";
import { useStyles } from "./styles";
import axios from "axios";
import { queryClient } from "../../../App";
import { Question } from "../../../types/models";

const CreateQuestionForm = ({
  surveyId,
  categoryId,
  trendId,
  onClose,
}: {
  surveyId: string;
  onClose: () => void;
  categoryId: string;
  trendId: string;
}) => {
  const { classes } = useStyles();

  const mutation = useMutation(
    async (newQuestion: Partial<Question>) => {
      return axios.post(
        `/survey/${surveyId}/category/${categoryId}/trend/${trendId}/question`,
        newQuestion
      );
    },
    {
      onSuccess: () => {
        onClose();
        queryClient.invalidateQueries(["surveyOne"]);
      },
    }
  );

  const { handleSubmit, handleChange, values } = useFormik<Partial<Question>>({
    initialValues: { title: "", primary: true },
    onSubmit: (val: Partial<Question>) => mutation.mutate(val),
  });

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        required
        label="Question content"
        placeholder="Question content"
        onChange={handleChange("title")}
      />

      <Switch
        checked={values.primary}
        onChange={(event) => {
          handleChange("primary")(event);
        }}
        label="primary"
      ></Switch>

      <Button className={classes.submitButton} type="submit">
        {mutation.isLoading ? "Loading" : "Create"}
      </Button>
    </form>
  );
};

export default CreateQuestionForm;
