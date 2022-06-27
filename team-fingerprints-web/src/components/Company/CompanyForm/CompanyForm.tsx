import axios from "axios";
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

import useDefaultErrorHandler from "hooks/useDefaultErrorHandler";
import { queryClient } from "App";
import { Company } from "types/models";
import { ProfileContext } from "routes";

import "./styles.sass";

const CompanyForm = ({
  initialValues,
  onClose,
}: {
  initialValues?: Partial<Company>;
  onClose: () => void;
}) => {
  const { invalidateProfile } = useContext(ProfileContext);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isUpdate = !!initialValues;
  const { onErrorWithTitle } = useDefaultErrorHandler();

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
      onError: onErrorWithTitle("Can not create company"),
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
      onError: onErrorWithTitle("Can not update company"),
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

  const classNames = {
    root: "company-form__input",
    input: "company-form__input-area",
    label: "company-form__label",
  };

  return (
    <form className="company-form" onSubmit={handleSubmit}>
      <TextInput
        classNames={classNames}
        ref={inputRef}
        required
        label={values.name && "Company name"}
        placeholder="Company name"
        value={values.name}
        onChange={handleChange("name")}
      />
      <Textarea
        classNames={classNames}
        required
        label={values.description && "Company description"}
        placeholder="Company description"
        value={values.description}
        onChange={handleChange("description")}
      />
      <TextInput
        classNames={classNames}
        label={values.domain && "Company domain"}
        placeholder="Company domain"
        value={values.domain}
        onChange={handleChange("domain")}
      />
      <Select
        classNames={{ ...classNames, dropdown: "company-form__dropdown" }}
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
      <Text className="company-form__color-label">Color</Text>
      <ColorPicker
        className="company-form__color"
        format="hex"
        value={values.pointColor}
        onChange={handleChange("pointColor")}
        size="md"
      />
      <Button className="company-form__submit" type="submit">
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
