import { Button, Modal } from "@mantine/core";
import React, { useState } from "react";
import CreateCategoryForm from "../CreateCategoryForm";

function AddCategoryButton({ surveyId }: { surveyId: string }) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <Modal
        opened={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Create Category"
      >
        <CreateCategoryForm
          surveyId={surveyId}
          onClose={() => setModalVisible(false)}
        />
      </Modal>
      <Button onClick={() => setModalVisible(true)}>Add new category</Button>
    </>
  );
}

export default AddCategoryButton;
