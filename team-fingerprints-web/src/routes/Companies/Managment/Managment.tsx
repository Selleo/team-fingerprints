import { Button, Modal, Skeleton } from "@mantine/core";
import React, { useContext, useState } from "react";
import { useQuery } from "react-query";
import times from "lodash/times";

import { useStyles } from "./styles";
import axios from "axios";
import { Company } from "../../../types/models";
import CompanyForm from "../../../components/Company/CompanyForm";
import { ProfileContext } from "../../../routes";

const CompaniesManagment = () => {
  const { profile } = useContext(ProfileContext);
  const { classes } = useStyles();
  const [modalVisible, setModalVisible] = useState(false);

  console.log(profile);

  const companyId = profile?.company?._id;

  const { isLoading, error, data } = useQuery<Company>(
    `companies${companyId}`,
    async () => {
      const response = await axios.get<Company>(`/companies/${companyId}`);
      return response.data;
    }
  );

  console.log(data);

  if (isLoading)
    return (
      <>
        {times(1, () => (
          <Skeleton height={40} mt={6} radius="xl" />
        ))}
      </>
    );
  if (error) return <div>'An error has occurred: ' + console.error;</div>;

  return (
    <>
      <div className={classes.header}>
        <h1 className={classes.headerTitle}>Company Managment</h1>
        <Button
          onClick={() => setModalVisible(true)}
          className={classes.addButton}
        >
          Edit company
        </Button>
      </div>
      <Modal
        opened={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Create Company"
      >
        <CompanyForm
          initialValues={data}
          onClose={() => setModalVisible(false)}
        />
      </Modal>
    </>
  );
};

export default CompaniesManagment;
