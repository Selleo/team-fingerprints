import { useEffect, useRef } from 'react'
import { TextInput, Button, Textarea } from "@mantine/core";
import { useFormik } from "formik";
import { useMutation } from "react-query";
import { useStyles } from "./styles";
import axios from "axios";
import { queryClient } from "../../../App";
import { Company } from "../../../types/models";

const CompanyForm = ({
  initialValues,
  onClose,
}: {
  initialValues?: Company;
  onClose: () => void;
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { classes } = useStyles();
  const isUpdate = !!initialValues;

  const onSuccess = () => {
    queryClient.invalidateQueries("companiesAll");
    queryClient.invalidateQueries(`companies${initialValues?._id}`);
  };

  const createMutation = useMutation(
    (newCompany: Partial<Company>) => {
      return axios
        .post<Partial<Company>>("/companies", newCompany)
        .then(onClose);
    },
    {
      onSuccess,
    }
  );

  const updateMutation = useMutation(
    (company: Partial<Company>) => {
      return axios
        .patch<Partial<Company>>(`/companies/${initialValues?._id}`, company)
        .then(onClose);
    },
    {
      onSuccess,
    }
  );

  const { handleSubmit, handleChange, values, setValues, setTouched } =
    useFormik<Partial<Company>>({
      initialValues: initialValues || { name: "", description: "", domain: "" },
      onSubmit: (val) =>
        isUpdate ? updateMutation.mutate(val) : createMutation.mutate(val),
    });

  useEffect(() => {
    const timeoutId = setTimeout(() => { 
      inputRef && inputRef.current!.focus() 
    }, 1);

    return () => clearTimeout(timeoutId)
  }, [])

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        ref={inputRef}
        required
        label="Company name"
        placeholder="Company name"
        value={values.name}
        onChange={handleChange("name")}
      />

      <Textarea
        required
        label="Company description"
        placeholder="Company description"
        value={values.description}
        onChange={handleChange("description")}
      />

      <TextInput
        required
        label="Company domain"
        placeholder="Company domain"
        value={values.domain}
        onChange={handleChange("domain")}
      />

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

export default CompanyForm;
