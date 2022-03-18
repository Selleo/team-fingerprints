import { useEffect, useRef } from "react";
import { TextInput, Button, Switch, Alert } from "@mantine/core";
import { BellIcon } from "@modulz/radix-icons";
import { useFormik } from "formik";
import { useMutation } from "react-query";
import { useStyles } from "./styles";
import axios from "axios";
import { queryClient } from "../../../App";
import { Survey } from "../../../types/models";
import useDefaultErrorHandler from "../../../hooks/useDefaultErrorHandler";

const SurveyForm = ({
  initialValues,
  onClose,
}: {
  initialValues?: Survey;
  onClose: () => void;
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { classes } = useStyles();
  const isUpdate = !!initialValues;

  const onSuccess = () => {
    queryClient.invalidateQueries(["surveysAll"]);
  };
  const { onErrorWithTitle } = useDefaultErrorHandler();

  const createMutation = useMutation(
    (newSurvey: Partial<Survey>) => {
      return axios.post<Partial<Survey>>("/surveys", newSurvey).then(onClose);
    },
    {
      onSuccess,
      onError: onErrorWithTitle("Can not create survey"),
    }
  );

  const updateMutation = useMutation(
    (survey: Partial<Survey>) => {
      return axios
        .patch<Partial<Survey>>(`/surveys/${survey._id}`, survey)
        .then(onClose);
    },
    {
      onSuccess,
      onError: onErrorWithTitle("Can not update survey"),
    }
  );

  const { handleSubmit, handleChange, values, setValues, setTouched } =
    useFormik<Partial<Survey>>({
      initialValues: initialValues || { title: "" },
      onSubmit: (val) =>
        isUpdate ? updateMutation.mutate(val) : createMutation.mutate(val),
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
