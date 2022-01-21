import { SegmentedControl } from "@mantine/core";
import axios from "axios";
import { toNumber } from "lodash";
import { useState } from "react";
import { useMutation } from "react-query";
import { Answer, Question } from "../../../types/models";

const OPTIONS = [
  { value: "1", label: "no" },
  { value: "2", label: "almost no" },
  { value: "3", label: "I don't have opinion" },
  { value: "4", label: "almost yes" },
  { value: "5", label: "yes" },
];

export default function QuestionResponse({
  question,
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
    responseMutation.mutate({ questionId: question._id, value: toNumber(val) });
  };

  return (
    <>
      <h3>{question.title}</h3>
      <SegmentedControl
        onChange={(val) => !disabled && setAndSaveNewValue(val)}
        value={value}
        fullWidth
        color={disabled ? "yellow" : "blue"}
        data={OPTIONS}
      />
    </>
  );
}
