import { TrashIcon } from "@modulz/radix-icons";
import { Button } from "@mantine/core";
import { useMutation } from "react-query";
import axios from "axios";
import { queryClient } from "../../../App";

const DeleteQuestionButton = ({
  trendId,
  categoryId,
  surveyId,
  questionId,
}: {
  trendId: string;
  categoryId: string;
  surveyId: string;
  questionId: string;
}) => {
  const mutation = useMutation(
    async () => {
      return axios.delete(
        `/survey/${surveyId}/category/${categoryId}/trend/${trendId}/question/${questionId}`
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["surveyOne"]);
      },
    }
  );

  return (
    <Button
      style={{ marginLeft: "10px" }}
      leftIcon={<TrashIcon />}
      variant="outline"
      onClick={() => mutation.mutate()}
      compact
    >
      Delete Question
    </Button>
  );
};

export default DeleteQuestionButton;
