import { Button, Modal } from "@mantine/core";
import React, { useState } from "react";
import { useStyles } from "./styles";
import CompanyForm from "../../../components/Company/CompanyForm";

const Companies = () => {
  const { classes } = useStyles();
  const [createModalVisible, setCreateModalVisible] = useState(false);

  return (
    <>
      <div className={classes.header}>
        <h1 className={classes.headerTitle}>
          Companies - you are not assigned to any company, create new company
        </h1>
        <Button
          onClick={() => setCreateModalVisible(true)}
          className={classes.addButton}
        >
          Add new company
        </Button>
      </div>
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
