import { TrashIcon } from "@modulz/radix-icons";
import { Button } from "@mantine/core";
import { useMutation } from "react-query";
import axios from "axios";
import { queryClient } from "../../../App";
import useDefaultErrorHandler from "../../../hooks/useDefaultErrorHandler";

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
  const { onErrorWithTitle } = useDefaultErrorHandler();

  const mutation = useMutation(
    async () => {
      return axios.delete(
        `/surveys/${surveyId}/categories/${categoryId}/trends/${trendId}/questions/${questionId}`
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("surveyOne" + surveyId);
      },
      onError: onErrorWithTitle("Can not delete question"),
    }
  );

  return (
    <Button
      leftIcon={<TrashIcon />}
      variant="outline"
      onClick={() => mutation.mutate()}
      compact
      style={{ color: "#ff0000", borderColor: "#ff0000" }}
    >
      Delete Question
    </Button>
  );
};

export default DeleteQuestionButton;
