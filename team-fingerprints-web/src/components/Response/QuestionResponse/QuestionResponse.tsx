import { SegmentedControl } from "@mantine/core";
import { useState } from "react";
import { Question } from "../../../types/models";

const OPTIONS = [
  { value: "1", label: "no" },
  { value: "2", label: "almost no" },
  { value: "3", label: "I don't have opinion" },
  { value: "4", label: "almost yes" },
  { value: "5", label: "yes" },
];

export default function QuestionResponse({ item }: { item: Question }) {
  const [value, setValue] = useState("none");

  const setAndSaveNewValue = (val: string) => {
    setValue(val);
  };

  return (
    <>
      <h3>{item.title}</h3>
      <SegmentedControl
        onChange={(val) => setAndSaveNewValue(val)}
        value={value}
        fullWidth
        color="blue"
        data={OPTIONS}
      />
    </>
  );
}
