import axios from "axios";

import { useState } from "react";
import { Button, Modal, TextInput } from "@mantine/core";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { queryClient } from "../../../App";
import { FullSurvey } from "team-fingerprints-common";

import SurveyForm from "../SurveyForm";
import useDefaultErrorHandler from "../../../hooks/useDefaultErrorHandler";
import ModalConfirmTrigger from "../../Modals/ModalConfirmTrigger";

const SurveyItem = ({ item }: { item: FullSurvey }) => {
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

  const updateMutation = useMutation(
    (survey: { id: string; update: { [key: string]: boolean } }) => {
      return axios.patch<Partial<FullSurvey>>(
        `/surveys/${survey.id}`,
        survey.update
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["surveysAll"]);
      },
      onError: onErrorWithTitle("Can not update survey"),
    }
  );

  return (
    <>
      <tr key={item._id}>
        <td>{item.title}</td>
        <td>{item.isPublic ? "public" : "not public"}</td>
        <td>{item.archived ? "archived" : "not archived"}</td>
        <td>{item.amountOfQuestions}</td>
        <td>
          <Button
            onClick={() => navigate(`/admin/survey/${item._id}`)}
            color="green"
            disabled={item.isPublic}
          >
            Edit
          </Button>
          <Button
            style={{ marginLeft: "10px" }}
            onClick={() => setModalVisible(true)}
          >
            Edit Title
          </Button>
          <Button
            style={{ marginLeft: "10px" }}
            onClick={() => setDuplicateModalVisible(true)}
          >
            Duplicate
          </Button>
          <ModalConfirmTrigger
            modalMessage={
              item.archived
                ? "Are you sure you want to unarchive this survey?"
                : "Are you sure you want to archive this survey?"
            }
            onConfirm={() => {
              {
                item.archived
                  ? updateMutation.mutate({
                      id: item._id,
                      update: { archived: false },
                    })
                  : updateMutation.mutate({
                      id: item._id,
                      update: { archived: true },
                    });
              }
            }}
            renderTrigger={(setModalVisible) => (
              <Button
                onClick={() => setModalVisible(true)}
                style={{ marginLeft: "10px" }}
                color={item.archived ? "pink" : "gray"}
              >
                {item.archived ? "Unarchive" : "Archive"}
              </Button>
            )}
          />
          {!item.isPublic && (
            <>
              <ModalConfirmTrigger
                modalMessage="Are you sure you want to delete this survey?"
                onConfirm={() => {
                  deleteMutation.mutate(item._id);
                }}
                renderTrigger={(setModalVisible) => (
                  <Button
                    style={{ marginLeft: "10px" }}
                    onClick={() => setModalVisible(true)}
                    color="red"
                  >
                    Delete
                  </Button>
                )}
              />
              <ModalConfirmTrigger
                modalMessage="Are you sure you want to publish this survey?"
                onConfirm={() => {
                  updateMutation.mutate({
                    id: item._id,
                    update: { isPublic: true },
                  });
                }}
                renderTrigger={(setModalVisible) => (
                  <Button
                    onClick={() => setModalVisible(true)}
                    style={{ marginLeft: "10px" }}
                    disabled={item.amountOfQuestions < 1}
                    color="green"
                  >
                    Publish
                  </Button>
                )}
              />
            </>
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
