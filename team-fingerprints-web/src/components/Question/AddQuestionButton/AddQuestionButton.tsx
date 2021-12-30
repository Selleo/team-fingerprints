import { Button, Modal } from "@mantine/core";
import { PlusCircledIcon } from "@modulz/radix-icons";
import React, { useState } from "react";
import QuestionForm from "../QuestionForm";

function AddQuestionButton({
  surveyId,
  categoryId,
  trendId,
}: {
  surveyId: string;
  categoryId: string;
  trendId: string;
}) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <Modal
        opened={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Create question"
      >
        <QuestionForm
          trendId={trendId}
          surveyId={surveyId}
          categoryId={categoryId}
          onClose={() => setModalVisible(false)}
        />
      </Modal>
      <Button
        leftIcon={<PlusCircledIcon />}
        variant="gradient"
        gradient={{ from: "teal", to: "blue" }}
        onClick={() => setModalVisible(true)}
      >
        Add new question
      </Button>
    </>
  );
}

export default AddQuestionButton;
