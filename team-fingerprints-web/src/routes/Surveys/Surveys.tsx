import axios from "axios";
import times from "lodash/times";
import isArray from "lodash/isArray";
import isEmpty from "lodash/isEmpty";

import { useState } from "react";
import { useQuery } from "react-query";
import { Button, Modal, Skeleton, Table } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { FullSurvey } from "team-fingerprints-common";

import SurveyItem from "components/Survey/SurveyItem";
import SurveyForm from "components/Survey/SurveyForm";
import ErrorLoading from "components/ErrorLoading";

import "./styles.sass";

const Surveys = () => {
  const navigate = useNavigate();
  const [createModalVisible, setCreateModalVisible] = useState(false);

  const { isLoading, error, data } = useQuery<FullSurvey[]>(
    "surveysAll",
    async () => {
      const response = await axios.get<FullSurvey[]>("/surveys");
      return response.data;
    }
  );

  if (isLoading)
    return (
      <>
        {times(5, () => (
          <Skeleton height={20} mt={6} radius="xl" />
        ))}
      </>
    );
  if (error) return <ErrorLoading title="Can't load surveys data" />;

  return (
    <div className="surveys-panel">
      <div className="surveys-panel__header">
        <h1 className="surveys-panel__title">Surveys</h1>
        <Button
          onClick={() => setCreateModalVisible(true)}
          className="surveys-panel__add-button"
        >
          Add new survey
        </Button>
        <Button
          onClick={() => navigate("/admin/users")}
          color="red"
          className="surveys-panel__add-button"
        >
          Remove User
        </Button>
      </div>
      <Table>
        <thead>
          <tr>
            <th>title</th>
            <th>is public</th>
            <th>is archived</th>
            <th>questions</th>
            <th>actions</th>
          </tr>
        </thead>
        {isArray(data) &&
          (isEmpty(data) ? (
            <span className="surveys-panel__empty">No surveys yet</span>
          ) : (
            <tbody>
              {data
                ?.sort(
                  (item1, item2) =>
                    new Date(item2.createdAt).getTime() -
                    new Date(item1.createdAt).getTime()
                )
                .map((item) => (
                  <SurveyItem item={item} />
                ))}
            </tbody>
          ))}
      </Table>
      <Modal
        opened={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        title="Create Survey"
      >
        <SurveyForm onClose={() => setCreateModalVisible(false)} />
      </Modal>
    </div>
  );
};

export default Surveys;
