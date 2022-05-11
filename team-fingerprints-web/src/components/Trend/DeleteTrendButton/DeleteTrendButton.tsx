import axios from "axios";

import { TrashIcon } from "@radix-ui/react-icons";
import { Button } from "@mantine/core";
import { useMutation } from "react-query";
import { queryClient } from "../../../App";

import useDefaultErrorHandler from "../../../hooks/useDefaultErrorHandler";
import ModalConfirmTrigger from "../../Modals/ModalConfirmTrigger";

const DeleteTrendButton = ({
  trendId,
  categoryId,
  surveyId,
}: {
  trendId: string;
  categoryId: string;
  surveyId: string;
}) => {
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
    <ModalConfirmTrigger
      modalMessage="Are you sure you want to delete this trend?"
      onConfirm={() => {
        mutation.mutate();
      }}
      renderTrigger={(setModalVisible) => (
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
      )}
    />
  );
};

export default DeleteTrendButton;
