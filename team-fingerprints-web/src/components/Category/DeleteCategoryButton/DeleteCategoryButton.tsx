import axios from "axios";
import { TrashIcon } from "@radix-ui/react-icons";
import { Button } from "@mantine/core";
import { useMutation } from "react-query";
import { queryClient } from "../../../App";
import useDefaultErrorHandler from "../../../hooks/useDefaultErrorHandler";
import ModalConfirmTrigger from "../../Modals/ModalConfirmTrigger";

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
          leftIcon={<TrashIcon />}
          variant="outline"
          onClick={() => {
            setModalVisible(true);
          }}
          compact
          style={{ color: "#ff0000", borderColor: "#ff0000" }}
        >
          Delete Category
        </Button>
      )}
    />
  );
};

export default DeleteCategoryButton;
