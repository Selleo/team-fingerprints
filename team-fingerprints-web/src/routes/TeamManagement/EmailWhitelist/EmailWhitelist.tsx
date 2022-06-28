import { FC, useContext } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Table, Badge, Group } from "@mantine/core";
import { first, groupBy, keys } from "lodash";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const currentUserEmail = user?.email;
  const grouped = groupBy(roles, "email");

  const rows = (keys(grouped) || []).map((email) => {
    const roles = grouped[email];
    const thatsMe = email === currentUserEmail;

    return (
      <tr className="team-table" key={email}>
        <td>{email}</td>
        <td>
          {roles.map((role) => {
            const isALeader = role.role === "TEAM_LEADER";
            const roleInTeam = isALeader ? "LEAD" : "MEMBER";

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
      </tr>
    );
  });

  return (
    <Table>
      <thead>
        <tr>
          <th>Users</th>
          <th>Roles</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
};

export default EmailWhitelist;
