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
      return axios.delete(`/surveys/${surveyId}/categories/${categoryId}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("surveyOne" + surveyId);
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
      style={{ color: '#ff0000', borderColor: '#ff0000' }}
    >
      Delete Category
    </Button>
  );
};

export default DeleteCategoryButton;
