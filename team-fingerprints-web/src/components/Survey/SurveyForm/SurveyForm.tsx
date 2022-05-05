import axios from "axios";

import { useEffect, useRef, useState } from "react";
import { TextInput, Button, Switch, Alert, Checkbox } from "@mantine/core";
import { BellIcon } from "@modulz/radix-icons";
import { useFormik } from "formik";
import { useMutation } from "react-query";

import ModalConfirmTrigger from "../../Modals/ModalConfirmTrigger";
import useDefaultErrorHandler from "../../../hooks/useDefaultErrorHandler";

import { useStyles } from "./styles";
import { queryClient } from "../../../App";
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
          <ModalConfirmTrigger
            modalMessage={
              !values.isPublic
                ? "Are you sure you want to public this survey?"
                : "Are you sure you want to unpublic this survey?"
            }
            onConfirm={() => {
              setValues({ ...values, isPublic: !values.isPublic });
              setTouched({ isPublic: true });
            }}
            renderTrigger={(setModalVisible) => (
              <Switch
                checked={values.isPublic}
                onChange={() => {
                  setModalVisible(true);
                }}
                color="red"
                label="public"
                style={{ marginTop: "10px", marginBottom: "10px" }}
              />
            )}
          />
          {values.isPublic && (
            <Alert icon={<BellIcon />} title="Warning!" color="red">
              Remember! Public property can be changed only once!
            </Alert>
          )}
        </>
      )}

      {isUpdate && (
        <ModalConfirmTrigger
          modalMessage={
            values.archived
              ? "Are you sure you want to unarchive this survey?"
              : "Are you sure you want to archive this survey?"
          }
          onConfirm={() => {
            setValues({ ...values, archived: !values.archived });
            setTouched({ archived: true });
          }}
          renderTrigger={(setModalVisible) => (
            <Checkbox
              checked={values.archived}
              onChange={() => {
                setModalVisible(true);
              }}
              color="dark"
              label="archive"
              style={{ marginTop: "15px" }}
            />
          )}
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
