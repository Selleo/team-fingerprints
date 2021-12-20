import { Button, Modal, Skeleton, Table } from "@mantine/core";
import React, { useState } from "react";
import { useQuery } from "react-query";
import times from "lodash/times";
import isArray from "lodash/isArray";
import isEmpty from "lodash/isEmpty";

import { useStyles } from "./styles";
import SurveyItem from "../../components/_Survey/SurveyItem";
import CreateSurveyForm from "../../components/CreateSurveyForm";

const Surveys = () => {
  const { classes } = useStyles();
  const [createModalVisible, setCreateModalVisible] = useState(false);

  const { isLoading, error, data } = useQuery("surveysAll", () =>
    fetch(`${process.env.REACT_APP_API_URL}/survey`).then((res) => res.json())
  );
  if (isLoading)
    return (
      <>
        {times(5, () => (
          <Skeleton height={20} mt={6} radius="xl" />
        ))}
      </>
    );
  if (error) return <div>'An error has occurred: ' + console.error;</div>;

  return (
    <>
      <div className={classes.header}>
        <h1 className={classes.headerTitle}>Surveys</h1>
        <Button
          onClick={() => setCreateModalVisible(true)}
          className={classes.addButton}
        >
          Add new survey
        </Button>
      </div>
      <Table>
        <thead>
          <tr>
            <th>title</th>
            <th>is public</th>
            <th>actions</th>
          </tr>
        </thead>
        {isArray(data) &&
          (isEmpty(data) ? (
            <span className={classes.emptyCopy}>No surveys yet</span>
          ) : (
            <tbody>
              {data?.map((item) => (
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
        <CreateSurveyForm onClose={() => setCreateModalVisible(false)} />
      </Modal>
    </>
  );
};

export default Surveys;
