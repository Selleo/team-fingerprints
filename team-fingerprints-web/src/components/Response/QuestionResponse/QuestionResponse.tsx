import { useState } from "react";

import { useMutation } from "react-query";
import { toNumber } from "lodash";
import axios from "axios";
import { SegmentedControl } from "@mantine/core";

import { useStyles } from "./styles";
import { Answer, Question } from "../../../types/models";

const OPTIONS = [
  { value: "1", label: "no" },
  { value: "2", label: "almost no" },
  { value: "3", label: "I don't have opinion" },
  { value: "4", label: "almost yes" },
  { value: "5", label: "yes" },
];

export default function QuestionResponse({
  question: {
    _id,
    title,
  },
  answer,
  surveyId,
  refetch,
  disabled = false,
}: {
  question: Question;
  answer?: number;
  surveyId: string;
  refetch: () => void;
  disabled: boolean;
}) {
  const { classes: { listItem } } = useStyles();
  const [value, setValue] = useState<string>(answer?.toString() || "none");

  const responseMutation = useMutation(
    async (surveyResponse: Answer) => {
      return axios.post(`/survey-answers/${surveyId}`, surveyResponse);
    },
    {
      onSuccess: () => {
        refetch();
      },
    }
  );

  const setAndSaveNewValue = (val: string) => {
    setValue(val);
    responseMutation.mutate({ questionId: _id, value: toNumber(val) });
  };

  return (
    <li className={listItem}> 
      <h3>{title}</h3>
      <SegmentedControl
        onChange={(val) => !disabled && setAndSaveNewValue(val)}
        value={value}
        fullWidth
        color={disabled ? "yellow" : "blue"}
        data={OPTIONS}
      />
    </li>
  );
}
