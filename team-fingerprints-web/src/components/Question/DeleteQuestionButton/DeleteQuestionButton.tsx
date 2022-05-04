import { useState } from "react";
import { TrashIcon } from "@modulz/radix-icons";
import { Button } from "@mantine/core";
import { useMutation } from "react-query";
import axios from "axios";
import { queryClient } from "../../../App";
import useDefaultErrorHandler from "../../../hooks/useDefaultErrorHandler";
import ModalWrapper from "../../ModalWrapper";

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
  const [modalVisible, setModalVisible] = useState(false);
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
    <ModalWrapper
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
      modalMsg="Are you sure you want to delete this question?"
      onConfirm={() => {
        mutation.mutate();
      }}
    >
      <Button
        leftIcon={<TrashIcon />}
        variant="outline"
        onClick={() => setModalVisible(true)}
        compact
        style={{ color: "#ff0000", borderColor: "#ff0000" }}
      >
        Delete Question
      </Button>
    </ModalWrapper>
  );
};

export default DeleteQuestionButton;
