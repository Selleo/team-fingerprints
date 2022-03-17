import { useContext, useEffect, useRef } from "react";
import {
  TextInput,
  Button,
  Textarea,
  Select,
  ColorPicker,
  Text,
} from "@mantine/core";
import { useFormik } from "formik";
import { useMutation } from "react-query";
import { useStyles } from "./styles";
import axios from "axios";
import { queryClient } from "../../../App";
import { Company } from "../../../types/models";
import { ProfileContext } from "../../../routes";

const CompanyForm = ({
  initialValues,
  onClose,
}: {
  initialValues?: Company;
  onClose: () => void;
}) => {
  const { invalidateProfile } = useContext(ProfileContext);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { classes } = useStyles();
  const isUpdate = !!initialValues;

  const onSuccess = () => {
    invalidateProfile();
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

  const { handleSubmit, handleChange, values } = useFormik<Partial<Company>>({
    initialValues: initialValues || {
      name: "",
      description: "",
      domain: "",
      pointShape: "square",
      pointColor: "#fff",
    },
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
      <Select
        label="Shape"
        placeholder="Pick one"
        data={[
          { value: "triangle", label: "triangle" },
          { value: "square", label: "square" },
          { value: "circle", label: "circle" },
          { value: "trapeze", label: "trapeze" },
        ]}
        onChange={(e: string) => handleChange("pointShape")(e)}
        value={values.pointShape}
      />
      <Text>Shape color</Text>
      <ColorPicker
        format="hex"
        value={values.pointColor}
        onChange={handleChange("pointColor")}
        size="md"
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
