import { Button, Modal } from "@mantine/core";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import React, { useState } from "react";
import TrendForm from "../TrendForm";

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
        <TrendForm
          surveyId={surveyId}
          categoryId={categoryId}
          onClose={() => setModalVisible(false)}
        />
      </Modal>
      <Button
        leftIcon={<PlusCircledIcon />}
        variant="gradient"
        gradient={{ to: "gray", from: "yellow" }}
        onClick={() => setModalVisible(true)}
      >
        Add new trend
      </Button>
    </>
  );
}

export default AddTrendButton;
