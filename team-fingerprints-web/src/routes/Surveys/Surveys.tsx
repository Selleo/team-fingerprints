import { Button, Skeleton, Table } from "@mantine/core";
import React from "react";
import { useQuery } from "react-query";
import times from "lodash/times";
import isArray from "lodash/isArray";

import { useStyles } from "./styles";
import SurveyItem from "../../components/_Survey/SurveyItem";

const Surveys = () => {
  const { classes } = useStyles();

  const { isLoading, error, data } = useQuery("surveys", () =>
    fetch(`${process.env.REACT_APP_API_URL}/surveys`).then((res) => res.json())
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

  console.log(data);

  return (
    <>
      <div className={classes.header}>
        <h1 className={classes.headerTitle}>Surveys</h1>
        <Button className={classes.addButton}>Add new survey</Button>
      </div>
      <Table>
        <thead>
          <tr>
            <th>Title</th>
            <th>is public</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {isArray(data) && data?.map((item) => <SurveyItem item={item} />)}
        </tbody>
      </Table>
    </>
  );
};

export default Surveys;
