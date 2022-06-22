import { useEffect, useRef } from "react";
import {
  TextInput,
  Button,
  Textarea,
  Select,
  ColorPicker,
  Text,
} from "@mantine/core";
import { useFormik } from "formik";
import { Team } from "types/models";

import "./styles.sass";

const TeamForm = ({
  initialValues,
  onSubmit,
}: {
  initialValues?: Partial<Team>;
  onSubmit: (values: Partial<Team>) => void;
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { handleSubmit, handleChange, values } = useFormik<Partial<Team>>({
    initialValues: initialValues || {
      name: "",
      description: "",
      pointShape: "trapeze",
      pointColor: "#a1a1a1",
    },
    onSubmit,
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      inputRef && inputRef.current!.focus();
    }, 1);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <form className="team-form" onSubmit={handleSubmit}>
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
      <Button className="team-form__submit-button" type="submit">
        Send
      </Button>
    </form>
  );
};

export default TeamForm;
