import { useEffect, useRef } from 'react'
import { TextInput, Button, Textarea } from "@mantine/core";
import { useFormik } from "formik";
import { Team } from "../../../types/models";
import { useStyles } from "./styles";

const TeamForm = ({
  initialValues,
  onSubmit,
}: {
  initialValues?: Partial<Team>;
  onSubmit: (values: Partial<Team>) => void;
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { classes } = useStyles();

  const { handleSubmit, handleChange, values } = useFormik<Partial<Team>>({
    initialValues: initialValues || { name: "", description: "" },
    onSubmit,
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
        label="Team name"
        placeholder="Team name"
        value={values.name}
        onChange={handleChange("name")}
      />

      <Textarea
        required
        label="Team description"
        placeholder="Team description"
        value={values.description}
        onChange={handleChange("description")}
      />

      <Button className={classes.submitButton} type="submit">
        Send
      </Button>
    </form>
  );
};

export default TeamForm;
