import { Button } from "@mantine/core";
import { useFormik } from "formik";

import { ReactMultiEmail, isEmail } from "react-multi-email";
import "react-multi-email/style.css";

import "./styles.sass";

interface FormValues {
  emails: string[];
}

const EmailForm = ({
  initialValues,
  onSubmit,
}: {
  initialValues?: FormValues;
  onSubmit: (val: Partial<FormValues>) => void;
}) => {
  const { handleSubmit, values, setFieldValue } = useFormik<
    Partial<FormValues>
  >({
    initialValues: initialValues || {
      emails: [],
    },
    onSubmit,
  });

  return (
    <form className="email-form" onSubmit={handleSubmit}>
      <ReactMultiEmail
        placeholder="placeholder"
        emails={values.emails}
        onChange={(_emails: string[]) => {
          setFieldValue("emails", _emails);
        }}
        validateEmail={(email) => {
          return isEmail(email); // return boolean
        }}
        getLabel={(
          email: string,
          index: number,
          removeEmail: (index: number) => void
        ) => {
          return (
            <div data-tag key={index}>
              {email}
              <span data-tag-handle onClick={() => removeEmail(index)}>
                ×
              </span>
            </div>
          );
        }}
      />

      <p className="email-form__info">
        You can parse there emails separated with spaces
      </p>

      <Button className="email-form__submitButton" type="submit">
        Send
      </Button>
    </form>
  );
};

export default EmailForm;
