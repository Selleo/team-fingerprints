import { Button, Modal, Skeleton, Table } from "@mantine/core";
import React, { useState } from "react";
import { useQuery } from "react-query";
import times from "lodash/times";
import isArray from "lodash/isArray";
import isEmpty from "lodash/isEmpty";

import { useStyles } from "./styles";
import axios from "axios";
import { Company } from "../../types/models";
import CompanyItem from "../../components/Company/CompanyItem";
import CompanyForm from "../../components/Company/CompanyForm";

const Companies = () => {
  const { classes } = useStyles();
  const [createModalVisible, setCreateModalVisible] = useState(false);

  const { isLoading, error, data } = useQuery<Company[]>(
    "companiesAll",
    async () => {
      const response = await axios.get<Company[]>("/companies");
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
  if (error) return <div>'An error has occurred: ' + console.error;</div>;

  return (
    <>
      <div className={classes.header}>
        <h1 className={classes.headerTitle}>
          Companies - only SUPERADMIN can see it!
        </h1>
        <Button
          onClick={() => setCreateModalVisible(true)}
          className={classes.addButton}
        >
          Add new company
        </Button>
      </div>
      <Table>
        <thead>
          <tr>
            <th>title</th>
            <th>actions</th>
          </tr>
        </thead>
        {isArray(data) &&
          (isEmpty(data) ? (
            <span className={classes.emptyCopy}>No companies yet</span>
          ) : (
            <tbody>
              {data?.map((item) => (
                <CompanyItem item={item} />
              ))}
            </tbody>
          ))}
      </Table>
      <Modal
        opened={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        title="Create Company"
      >
        <CompanyForm onClose={() => setCreateModalVisible(false)} />
      </Modal>
    </>
  );
};

export default Companies;
