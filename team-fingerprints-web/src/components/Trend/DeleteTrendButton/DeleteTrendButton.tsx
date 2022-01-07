import { TrashIcon } from "@modulz/radix-icons";
import { Button } from "@mantine/core";
import { useMutation } from "react-query";
import axios from "axios";
import { queryClient } from "../../../App";

const DeleteTrendButton = ({
  trendId,
  categoryId,
  surveyId,
}: {
  trendId: string;
  categoryId: string;
  surveyId: string;
}) => {
  const mutation = useMutation(
    async () => {
      return axios.delete(
        `/surveys/${surveyId}/categories/${categoryId}/trends/${trendId}`
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
      leftIcon={<TrashIcon />}
      variant="outline"
      color="yellow"
      onClick={() => mutation.mutate()}
      compact
    >
      Delete Trend
    </Button>
  );
};

export default DeleteTrendButton;
