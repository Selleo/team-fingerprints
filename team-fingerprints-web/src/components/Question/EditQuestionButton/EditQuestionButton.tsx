import { Button, Modal } from "@mantine/core";
import { Pencil1Icon } from "@modulz/radix-icons";
import { useState } from "react";
import { Question } from "../../../types/models";
import QuestionForm from "../QuestionForm";

function EditQuestionButton({
  surveyId,
  categoryId,
  trendId,
  question,
}: {
  surveyId: string;
  categoryId: string;
  trendId: string;
  question: Question;
}) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <Modal
        opened={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Edit question"
      >
        <QuestionForm
          initialValues={question}
          trendId={trendId}
          surveyId={surveyId}
          categoryId={categoryId}
          onClose={() => setModalVisible(false)}
        />
      </Modal>
      <Button
        leftIcon={<Pencil1Icon />}
        variant="outline"
        color="blue"
        onClick={() => setModalVisible(true)}
        compact
      >
        Edit question
      </Button>
    </>
  );
}

export default EditQuestionButton;
