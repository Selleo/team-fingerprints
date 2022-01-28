import { TextInput, Button } from "@mantine/core";
import { useFormik } from "formik";
import { useStyles } from "./styles";

interface FormValues {
  email: string;
}

const EmailForm = ({
  initialValues,
  onSubmit,
}: {
  initialValues?: FormValues;
  onSubmit: (val: Partial<FormValues>) => void;
}) => {
  const { classes } = useStyles();

  const { handleSubmit, handleChange, values } = useFormik<Partial<FormValues>>(
    {
      initialValues: initialValues || {
        email: "",
      },
      onSubmit,
    }
  );

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        required
        label="Email address"
        placeholder="Email address"
        value={values.email}
        onChange={handleChange("email")}
      />

      <Button className={classes.submitButton} type="submit">
        Send
      </Button>
    </form>
  );
};

export default EmailForm;
