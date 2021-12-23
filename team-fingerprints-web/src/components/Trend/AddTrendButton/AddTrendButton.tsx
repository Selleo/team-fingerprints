import { Button, Modal } from "@mantine/core";
import { PlusCircledIcon } from "@modulz/radix-icons";
import React, { useState } from "react";
import CreateTrendForm from "../CreateTrendForm";

function AddTrendButton({
  surveyId,
  categoryId,
}: {
  surveyId: string;
  categoryId: string;
}) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <Modal
        opened={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Create Trend"
      >
        <CreateTrendForm
          surveyId={surveyId}
          categoryId={categoryId}
          onClose={() => setModalVisible(false)}
        />
      </Modal>
      <Button
        leftIcon={<PlusCircledIcon />}
        variant="gradient"
        gradient={{ from: "white", to: "pink" }}
        onClick={() => setModalVisible(true)}
      >
        Add new trend
      </Button>
    </>
  );
}

export default AddTrendButton;
