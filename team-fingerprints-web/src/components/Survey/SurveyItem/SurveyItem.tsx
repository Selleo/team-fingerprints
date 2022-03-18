import { Button, Modal } from "@mantine/core";
import React, { useState } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { queryClient } from "../../../App";
import { Survey } from "../../../types/models";
import SurveyForm from "../SurveyForm";
import axios from "axios";
import useDefaultErrorHandler from "../../../hooks/useDefaultErrorHandler";

const SurveyItem = ({ item }: { item: Survey }) => {
  const navigate = useNavigate();
  const [modalVisible, setModalVisible] = useState(false);
  const { onErrorWithTitle } = useDefaultErrorHandler();

  const deleteMutation = useMutation(
    (surveyId: string) => {
      return axios.delete(`/surveys/${surveyId}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["surveysAll"]);
      },
      onError: onErrorWithTitle("Can not remove survey"),
    }
  );

  return (
    <>
      <tr key={item._id}>
        <td>{item.title}</td>
        <td>{item.isPublic ? "public" : "not public"}</td>
        <td>
          <Button onClick={() => navigate(`/survey/${item._id}`)} color="green">
            Show
          </Button>
          <Button
            style={{ marginLeft: "10px", opacity: item.isPublic ? ".3" : "1" }}
            onClick={() => setModalVisible(true)}
          >
            Edit
          </Button>
          {!item.isPublic && (
            <Button
              style={{ marginLeft: "10px" }}
              onClick={() => deleteMutation.mutate(item._id)}
              color="red"
            >
              Delete
            </Button>
          )}
        </td>
      </tr>
      <Modal
        opened={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Edit survey"
      >
        <SurveyForm
          initialValues={item}
          onClose={() => setModalVisible(false)}
        />
      </Modal>
    </>
  );
};

export default SurveyItem;
