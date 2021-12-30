import { TextInput, Button, Switch, Alert } from "@mantine/core";
import { BellIcon } from "@modulz/radix-icons";
import { useFormik } from "formik";
import { useMutation } from "react-query";
import { useStyles } from "./styles";
import axios from "axios";
import { queryClient } from "../../../App";
import { Survey } from "../../../types/models";

const SurveyForm = ({
  initialValues,
  onClose,
}: {
  initialValues?: Survey;
  onClose: () => void;
}) => {
  const { classes } = useStyles();
  const isUpdate = !!initialValues;

  const onSuccess = () => {
    queryClient.invalidateQueries(["surveysAll"]);
  };

  const createMutation = useMutation(
    (newSurvey: Partial<Survey>) => {
      return axios.post<Partial<Survey>>("/survey", newSurvey).then(onClose);
    },
    {
      onSuccess,
    }
  );

  const updateMutation = useMutation(
    (survey: Partial<Survey>) => {
      return axios
        .patch<Partial<Survey>>(`/survey/${survey._id}`, survey)
        .then(onClose);
    },
    {
      onSuccess,
    }
  );

  const { handleSubmit, handleChange, values, setValues, setTouched } =
    useFormik<Partial<Survey>>({
      initialValues: initialValues || { title: "" },
      onSubmit: (val) =>
        isUpdate ? updateMutation.mutate(val) : createMutation.mutate(val),
    });

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        required
        label="Survey title"
        placeholder="Survey name"
        value={values.title}
        onChange={handleChange("title")}
      />

      {isUpdate && !initialValues.isPublic && (
        <>
          <Switch
            checked={values.isPublic}
            onChange={(event) => {
              setValues({ ...values, isPublic: event.currentTarget.checked });
              setTouched({ isPublic: true });
            }}
            color="red"
            label="public"
            style={{ marginTop: "10px", marginBottom: "10px" }}
          ></Switch>
          {values.isPublic && (
            <Alert icon={<BellIcon />} title="Warning!" color="red">
              Remember! Public property can be changed only once!
            </Alert>
          )}
        </>
      )}

      <Button className={classes.submitButton} type="submit">
        {createMutation.isLoading || updateMutation.isLoading
          ? "Loading"
          : isUpdate
          ? "Update"
          : "Create"}
      </Button>
    </form>
  );
};

export default SurveyForm;
