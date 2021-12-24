import { TrashIcon } from "@modulz/radix-icons";
import { Button } from "@mantine/core";
import { useMutation } from "react-query";
import axios from "axios";
import { queryClient } from "../../../App";

const DeleteCategoryButton = ({
  categoryId,
  surveyId,
}: {
  categoryId: string;
  surveyId: string;
}) => {
  const mutation = useMutation(
    async () => {
      return axios.delete(`/survey/${surveyId}/category/${categoryId}`);
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
      color="pink"
      onClick={() => mutation.mutate()}
      compact
    >
      Delete Category
    </Button>
  );
};

export default DeleteCategoryButton;
