import axios from "axios";

import { useState } from "react";
import { TrashIcon } from "@modulz/radix-icons";
import { Button } from "@mantine/core";
import { useMutation } from "react-query";
import { queryClient } from "../../../App";

import useDefaultErrorHandler from "../../../hooks/useDefaultErrorHandler";
import ModalWrapper from "../../ModalWrapper";

const DeleteTrendButton = ({
  trendId,
  categoryId,
  surveyId,
}: {
  trendId: string;
  categoryId: string;
  surveyId: string;
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { onErrorWithTitle } = useDefaultErrorHandler();

  const mutation = useMutation(
    async () => {
      return axios.delete(
        `/surveys/${surveyId}/categories/${categoryId}/trends/${trendId}`
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("surveyOne" + surveyId);
      },
      onError: onErrorWithTitle("Can not delete trend"),
    }
  );

  return (
    <ModalWrapper
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
      modalMsg="Are you sure you want to delete this trend?"
      onConfirm={() => {
        mutation.mutate();
      }}
    >
      <Button
        leftIcon={<TrashIcon />}
        variant="outline"
        color="yellow"
        onClick={() => setModalVisible(true)}
        compact
        style={{ color: "#ff0000", borderColor: "#ff0000" }}
      >
        Delete Trend
      </Button>
    </ModalWrapper>
  );
};

export default DeleteTrendButton;
