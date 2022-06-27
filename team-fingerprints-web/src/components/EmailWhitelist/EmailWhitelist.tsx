import { FC, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Badge } from "@mantine/core";
import { groupBy, keys, map } from "lodash";

import ModalConfirmTrigger from "components/Modals/ModalConfirmTrigger";
import { CompanyRole, Team } from "types/models";
import { ProfileContext } from "routes";

import "./styles.sass";

interface IProps {
  onRemove?: (email: string) => void;
  roles: CompanyRole[];
  teams?: Team[];
}

const EmailWhitelist: FC<IProps> = ({ onRemove, roles, teams }) => {
  const { profile } = useContext(ProfileContext);
  const navigate = useNavigate();
  const grouped = groupBy(roles, "email");

  const rows = map(keys(grouped), (email) => {
    const roles = grouped[email];
    const thatsMe = email === profile?.email;

    return (
      <tr
        className="company-table"
        style={{ backgroundColor: "#0A0B0B" }}
        key={email}
      >
        <td>{email}</td>
        <td>
          {roles.map((role) => {
            const team = teams?.find((team) => role.teamId === team._id);
            return (
              <Badge
                size="lg"
                variant="dot"
                className="company-table__badge"
                color={role.userId ? "green" : "yellow"}
              >
                <div className="company-table__badge-wrapper">
                  <div>
                    {team && (
                      <span className="company-table__team-name">
                        {team.name + " | "}
                      </span>
                    )}
                    {!role.userId && (
                      <span className="company-table__pending">PENDING </span>
                    )}
                    {role.role}
                  </div>
                  <ModalConfirmTrigger
                    modalMessage="Are you sure you want to delete this role?"
                    onConfirm={() => {
                      onRemove?.(role._id);
                    }}
                    renderTrigger={(setModalVisible) => (
                      <button
                        onClick={() => setModalVisible(true)}
                        className="company-table__x"
                      >
                        X
                      </button>
                    )}
                  />
                </div>
              </Badge>
            );
          })}
        </td>
      </tr>
    );
  });

  return (
    <Table>
      <thead>
        <tr>
          <th>User</th>
          <th>Roles</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
};

export default EmailWhitelist;
