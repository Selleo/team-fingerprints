import { Button, Modal } from "@mantine/core";
import { useState } from "react";

import CompanyForm from "components/Company/CompanyForm";

import "./styles.sass";

const Companies = () => {
  const [createModalVisible, setCreateModalVisible] = useState(false);

  return (
    <div className="companies">
      <div className="companies__header">
        <h1 className="companies__title">
          Companies - you are not assigned to any company, create new company
        </h1>
        <Button
          onClick={() => setCreateModalVisible(true)}
          className="companies__add-button"
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
    </div>
  );
};

export default Companies;
