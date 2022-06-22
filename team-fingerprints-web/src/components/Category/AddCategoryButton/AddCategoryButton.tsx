import { useState } from "react";
import { Button, Modal } from "@mantine/core";
import { PlusCircledIcon } from "@modulz/radix-icons";
import CategoryForm from "../CategoryForm";

function AddCategoryButton({ surveyId }: { surveyId: string }) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <Modal
        opened={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Create Category"
      >
        <CategoryForm
          surveyId={surveyId}
          onClose={() => setModalVisible(false)}
        />
      </Modal>
      <Button
        leftIcon={<PlusCircledIcon />}
        variant="gradient"
        gradient={{ from: "pink", to: "gray" }}
        onClick={() => setModalVisible(true)}
      >
        Add new category
      </Button>
    </>
  );
}

export default AddCategoryButton;
