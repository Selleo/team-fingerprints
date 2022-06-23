import axios from "axios";
import { TrashIcon } from "@modulz/radix-icons";
import { Button } from "@mantine/core";
import { useMutation } from "react-query";

import useDefaultErrorHandler from "hooks/useDefaultErrorHandler";
import ModalConfirmTrigger from "components/Modals/ModalConfirmTrigger";
import { queryClient } from "App";

import "./styles.sass";

const DeleteCategoryButton = ({
  categoryId,
  surveyId,
}: {
  categoryId: string;
  surveyId: string;
}) => {
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
    <ModalConfirmTrigger
      modalMessage="Are you sure you want to delete this category?"
      onConfirm={() => {
        mutation.mutate();
      }}
      renderTrigger={(setModalVisible) => (
        <Button
          className="deleteCategory"
          leftIcon={<TrashIcon />}
          variant="outline"
          onClick={() => {
            setModalVisible(true);
          }}
          compact
        >
          Delete Category
        </Button>
      )}
    />
  );
};

export default DeleteCategoryButton;
