import { Button, Modal } from "@mantine/core";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { useState } from "react";
import { Category } from "../../../types/models";
import CategoryForm from "../CategoryForm";

function EditCategoryButton({
  category,
  surveyId,
}: {
  category: Category;
  surveyId: string;
}) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <Modal
        opened={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Update Category"
      >
        <CategoryForm
          surveyId={surveyId}
          initialValues={category}
          onClose={() => setModalVisible(false)}
        />
      </Modal>
      <Button
        variant="outline"
        color="pink"
        compact
        leftIcon={<Pencil1Icon />}
        onClick={() => setModalVisible(true)}
      >
        Update category
      </Button>
    </>
  );
}

export default EditCategoryButton;
