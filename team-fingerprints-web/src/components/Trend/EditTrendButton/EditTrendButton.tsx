import { Button, Modal } from "@mantine/core";
import { Pencil1Icon } from "@radix-ui/react-icons";
import React, { useState } from "react";
import { Trend } from "../../../types/models";
import TrendForm from "../TrendForm";

function EditTrendButton({
  surveyId,
  categoryId,
  trend,
}: {
  surveyId: string;
  categoryId: string;
  trend: Trend;
}) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <Modal
        opened={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Update Trend"
      >
        <TrendForm
          surveyId={surveyId}
          categoryId={categoryId}
          onClose={() => setModalVisible(false)}
          initialValues={trend}
        />
      </Modal>
      <Button
        leftIcon={<Pencil1Icon />}
        variant="outline"
        color="yellow"
        onClick={() => setModalVisible(true)}
        compact
      >
        Update trend
      </Button>
    </>
  );
}

export default EditTrendButton;
