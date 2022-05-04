import { useState } from "react";
import { TrashIcon } from "@modulz/radix-icons";
import { Button } from "@mantine/core";
import { useMutation } from "react-query";
import axios from "axios";
import { queryClient } from "../../../App";
import useDefaultErrorHandler from "../../../hooks/useDefaultErrorHandler";
import ModalWrapper from "../../ModalWrapper";

const DeleteCategoryButton = ({
  categoryId,
  surveyId,
}: {
  categoryId: string;
  surveyId: string;
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { onErrorWithTitle } = useDefaultErrorHandler();

  const mutation = useMutation(
    async () => {
      return axios.delete(`/surveys/${surveyId}/categories/${categoryId}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("surveyOne" + surveyId);
      },
      onError: onErrorWithTitle("Can not create category"),
    }
  );

  return (
    <ModalWrapper
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
      modalMsg="Are you sure you want to delete this category?"
      onConfirm={() => {
        mutation.mutate();
      }}
    >
      <Button
        leftIcon={<TrashIcon />}
        variant="outline"
        color="pink"
        onClick={() => {
          setModalVisible(true);
        }}
        compact
        style={{ color: "#ff0000", borderColor: "#ff0000" }}
      >
        Delete Category
      </Button>
    </ModalWrapper>
  );
};

export default DeleteCategoryButton;
