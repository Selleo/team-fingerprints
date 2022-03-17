import { TrashIcon } from "@modulz/radix-icons";
import { Button } from "@mantine/core";
import { useMutation } from "react-query";
import axios from "axios";
import { queryClient } from "../../../App";
import useDefaultErrorHandler from "../../../hooks/useDefaultErrorHandler";

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
    <Button
      leftIcon={<TrashIcon />}
      variant="outline"
      color="yellow"
      onClick={() => mutation.mutate()}
      compact
      style={{ color: "#ff0000", borderColor: "#ff0000" }}
    >
      Delete Trend
    </Button>
  );
};

export default DeleteTrendButton;
