import { FC, useContext } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Table, Badge, Button } from "@mantine/core";
import { first, groupBy, keys } from "lodash";

import ModalConfirmTrigger from "components/Modals/ModalConfirmTrigger";
import { ProfileContext } from "routes";
import { CompanyRole } from "types/models";

import "./styles.sass";

interface IProps {
  roles: CompanyRole[];
  onRemove?: (email: string) => void;
  makeALeader: (email: string) => void;
  removeLeaderRole: (email: string) => void;
}

const EmailWhitelist: FC<IProps> = ({
  roles,
  onRemove,
  makeALeader,
  removeLeaderRole,
}) => {
  const firstRole = first(roles);
  const { profile } = useContext(ProfileContext);
  const currentUserIsCompanyAdmin = !!profile?.privileges.find(
    (elem) =>
      elem.company?._id === firstRole?.companyId &&
      elem.role === "COMPANY_ADMIN"
  );
  const { user } = useAuth0();
  const currentUserEmail = user?.email;
  const grouped = groupBy(roles, "email");

  const currentLeader = roles.find((role) => role.role === "TEAM_LEADER");
  const currentUserisLeader = currentUserEmail === currentLeader?.email;

  const rows = (keys(grouped) || []).map((email) => {
    const roles = grouped[email];

    return (
      <tr className="company-table" key={email}>
        <td>{email}</td>
        <td className="company-table__content">
          {roles.map((role) => {
            const isALeader = role.role === "TEAM_LEADER";
            const roleInTeam = isALeader ? "TEAM LEADER" : "MEMBER";

            return (
              <Badge
                size="lg"
                variant="dot"
                className="company-table__badge"
                color={role.userId ? "green" : "yellow"}
              >
                <div className="company-table__badge-wrapper">
                  <div>
                    {!role.userId && (
                      <span className="company-table__pending">PENDING </span>
                    )}
                    {roleInTeam}
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
        {currentUserIsCompanyAdmin && (
          <td>
            {!currentUserisLeader && email !== currentLeader?.email && (
              <Button
                className="company-table__make-leader"
                size="xs"
                compact
                variant="outline"
                onClick={() => {
                  makeALeader?.(email);
                }}
                color="green"
              >
                Make a leader
              </Button>
            )}
            {currentUserisLeader && email == currentLeader?.email && (
              <Button
                className="company-table__make-leader"
                size="xs"
                compact
                variant="outline"
                onClick={() => {
                  onRemove?.(currentLeader?._id);
                }}
                color="red"
              >
                Remove a leader
              </Button>
            )}
          </td>
        )}
      </tr>
    );
  });

  return (
    <Table>
      <thead>
        <tr>
          <th>Users</th>
          <th>Roles</th>
          {currentUserIsCompanyAdmin && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
};

export default EmailWhitelist;
