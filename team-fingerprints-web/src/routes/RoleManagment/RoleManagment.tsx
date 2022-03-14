import { Button, Modal } from "@mantine/core";
import { isEmpty } from "lodash";
import React, { useContext, useMemo, useState } from "react";
import BackToScreen from "../../components/BackToScreen/BackToScreen";
import CompanyForm from "../../components/Company/CompanyForm";
import { ProfileContext } from "../../routes";

import "./styles.sass";

export const RoleManagment = () => {
  const { profile } = useContext(ProfileContext);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const emptyRoles = useMemo(() => isEmpty(profile?.privileges), [profile]);
  const content = useMemo(() => {
    if (emptyRoles) {
      return (
        <span>
          You don't have any associated companies, you can create your own or
          ask any other user to invite you
        </span>
      );
    }
    return (
      <ul className="managment__roles">
        {profile?.privileges.map((item) => (
          <li className="managment__roles__role">
            <span>
              {item.company.name} - {item.team?.name} - {item.role}
            </span>
          </li>
        ))}
      </ul>
    );
  }, [emptyRoles]);

  return (
    <>
      <BackToScreen name="Dashboard" />

      <div className="managment">
        <Button
          variant="outline"
          color="#32A89C"
          onClick={() => setCreateModalVisible(true)}
          className="managment__company-button"
        >
          Create company
        </Button>
        <h1 className="managment__headline">Your companies and roles</h1>
        {content}
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

export default RoleManagment;
