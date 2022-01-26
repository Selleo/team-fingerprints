import React, { useState } from "react";
import { Button, Modal } from "@mantine/core";
import { useMutation } from "react-query";
import { queryClient } from "../../../App";
import { Company } from "../../../types/models";
import axios from "axios";
import CompanyForm from "../CompanyForm";

const CompanyItem = ({ item }: { item: Company }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <tr key={item._id}>
        <td>{item.name}</td>
        <td>
          <Button
            style={{ marginLeft: "10px" }}
            onClick={() => setModalVisible(true)}
          >
            Edit
          </Button>
        </td>
      </tr>
      <Modal
        opened={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Edit company"
      >
        <CompanyForm
          initialValues={item}
          onClose={() => setModalVisible(false)}
        />
      </Modal>
    </>
  );
};

export default CompanyItem;
