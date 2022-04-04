import { useAuth0 } from "@auth0/auth0-react";
import { Button, Table, Badge, Group } from "@mantine/core";
import { first, groupBy, keys } from "lodash";
import { FC, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ProfileContext } from "../../../routes";
import { CompanyRole } from "../../../types/models";

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
    const thatsMe = email === currentUserEmail;

    return (
      <>
        <tr style={{ backgroundColor: "#444" }} key={email}>
          <td>{email}</td>
          <td></td>
          <td></td>
        </tr>
        {grouped[email].map((role) => {
          const isALeader = role.role === "TEAM_LEADER";
          const roleInTeam = isALeader ? "LEAD" : "MEMBER";

          return (
            <tr key={role._id}>
              <td></td>
              {thatsMe ? (
                <td>That's you</td>
              ) : (
                <td>
                  {user ? (
                    <Badge>{roleInTeam}</Badge>
                  ) : (
                    <Badge>{`PENDING ${roleInTeam}`}</Badge>
                  )}
                </td>
              )}
              <td>
                {thatsMe ? (
                  <Button onClick={() => navigate("/manage")} color="blue">
                    Self role managment
                  </Button>
                ) : (
                  <Group>
                    {
                      <Button onClick={() => onRemove?.(role._id)} color="red">
                        Remove
                      </Button>
                    }
                    {currentUserIsCompanyAdmin && (
                      <>
                        {!isALeader && (
                          <Button
                            onClick={() => makeALeader?.(role.email)}
                            color="green"
                          >
                            Make a leader
                          </Button>
                        )}
                        {isALeader && (
                          <Button
                            onClick={() => removeLeaderRole?.(role.email)}
                            color="red"
                          >
                            Remove leadership
                          </Button>
                        )}
                      </>
                    )}
                  </Group>
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
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
};

export default EmailWhitelist;
