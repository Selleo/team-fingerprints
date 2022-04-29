import { useEffect, useRef } from "react";
import { TextInput, Button, Switch, Alert, Checkbox } from "@mantine/core";
import { BellIcon } from "@modulz/radix-icons";
import { useFormik } from "formik";
import { useMutation } from "react-query";
import { useStyles } from "./styles";
import axios from "axios";
import { queryClient } from "../../../App";
import useDefaultErrorHandler from "../../../hooks/useDefaultErrorHandler";
import { FullSurvey } from "team-fingerprints-common";

const SurveyForm = ({
  initialValues,
  onClose,
}: {
  initialValues?: FullSurvey;
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
    (newSurvey: Partial<FullSurvey>) => {
      return axios
        .post<Partial<FullSurvey>>("/surveys", newSurvey)
        .then(onClose);
    },
    {
      onSuccess,
      onError: onErrorWithTitle("Can not create survey"),
    }
  );

  const updateMutation = useMutation(
    (survey: Partial<FullSurvey>) => {
      return axios
        .patch<Partial<FullSurvey>>(`/surveys/${survey._id}`, survey)
        .then(onClose);
    },
    {
      onSuccess,
      onError: onErrorWithTitle("Can not update survey"),
    }
  );

  const { handleSubmit, handleChange, values, setValues, setTouched } =
    useFormik<Partial<FullSurvey>>({
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
          />
          {values.isPublic && (
            <Alert icon={<BellIcon />} title="Warning!" color="red">
              Remember! Public property can be changed only once!
            </Alert>
          )}
        </>
      )}

      {isUpdate && (
        <Checkbox
          checked={values.archived}
          onChange={(event) => {
            setValues({ ...values, archived: event.currentTarget.checked });
            setTouched({ archived: true });
          }}
          color="dark"
          label="archive"
          style={{ marginTop: "15px" }}
        />
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
