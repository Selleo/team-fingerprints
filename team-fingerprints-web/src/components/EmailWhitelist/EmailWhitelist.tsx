import { Button, Table, Badge } from "@mantine/core";
import { groupBy, keys, map } from "lodash";
import { FC, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProfileContext } from "../../routes";
import { CompanyRole, Team } from "../../types/models";
import ModalWrapper from "./../ModalWrapper";

interface IProps {
  onRemove?: (email: string) => void;
  roles: CompanyRole[];
  teams?: Team[];
}

const EmailWhitelist: FC<IProps> = ({ onRemove, roles, teams }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { profile } = useContext(ProfileContext);
  const navigate = useNavigate();
  const grouped = groupBy(roles, "email");
  const rows = map(keys(grouped), (email) => {
    const roles = grouped[email];
    const thatsMe = email === profile?.email;
    return (
      <>
        <tr style={{ backgroundColor: "#0A0B0B" }} key={email}>
          <td>{email}</td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        {roles.map((role) => {
          return (
            <tr key={role._id}>
              <td></td>
              {thatsMe ? (
                <td>
                  <Badge color="green">{role?.role}</Badge>
                </td>
              ) : (
                <td>
                  {role.userId ? (
                    <Badge color="green">{role.role}</Badge>
                  ) : (
                    <Badge color="yellow">Pending {role.role}</Badge>
                  )}
                </td>
              )}
              <td>{teams?.find((team) => team._id === role.teamId)?.name}</td>
              <td>
                {thatsMe ? (
                  <Button onClick={() => navigate("/manage")} color="blue">
                    Self role managment
                  </Button>
                ) : (
                  <ModalWrapper
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
                    modalMsg="Are you sure you want to delete this user?"
                    onConfirm={() => {
                      onRemove?.(role._id);
                    }}
                  >
                    <Button onClick={() => setModalVisible(true)} color="red">
                      Remove
                    </Button>
                  </ModalWrapper>
                )}
              </td>
            </tr>
          );
        })}
      </>
    );
  });

  return (
    <Table>
      <thead>
        <tr>
          <th>Whitelisted Emails</th>
          <th>Is in system?</th>
          <th>Team</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
};

export default EmailWhitelist;
