import { TrashIcon } from "@radix-ui/react-icons";
import { Button } from "@mantine/core";
import { useMutation } from "react-query";
import axios from "axios";
import { queryClient } from "../../../App";
import useDefaultErrorHandler from "../../../hooks/useDefaultErrorHandler";
import ModalConfirmTrigger from "../../Modals/ModalConfirmTrigger";

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
    <ModalConfirmTrigger
      modalMessage="Are you sure you want to delete this question?"
      onConfirm={() => {
        mutation.mutate();
      }}
      renderTrigger={(setModalVisible) => (
        <Button
          leftIcon={<TrashIcon />}
          variant="outline"
          onClick={() => setModalVisible(true)}
          compact
          style={{ color: "#ff0000", borderColor: "#ff0000" }}
        >
          Delete Question
        </Button>
      )}
    />
  );
};

export default DeleteQuestionButton;
