import { Button, Modal, TextInput } from "@mantine/core";
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
  const [duplicateModalVisible, setDuplicateModalVisible] = useState(false);
  const [duplicationName, setDuplicationName] = useState(`${item.title} copy`);
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

  const duplicate = useMutation(
    (surveyId: string) => {
      return axios.post(`/surveys/${surveyId}/duplicate`, {
        title: duplicationName,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["surveysAll"]);
        setDuplicateModalVisible(false);
      },
      onError: onErrorWithTitle("Can not duplciate survey"),
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
          <Button
            style={{ marginLeft: "10px" }}
            onClick={() => setDuplicateModalVisible(true)}
          >
            Duplicate
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
      <Modal
        opened={duplicateModalVisible}
        onClose={() => setDuplicateModalVisible(false)}
        title="Duplicate survey"
      >
        <TextInput
          style={{ marginBottom: "15px" }}
          required
          label="New survey name"
          placeholder="New survey name"
          value={duplicationName}
          onChange={(e) => setDuplicationName(e.currentTarget.value)}
        />
        <Button onClick={() => duplicate.mutate(item._id)} type="submit">
          Duplicate
        </Button>
      </Modal>
    </>
  );
};

export default SurveyItem;
