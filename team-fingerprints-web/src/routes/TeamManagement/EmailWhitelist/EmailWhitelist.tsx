import { useAuth0 } from "@auth0/auth0-react";
import { Button, Table, Badge, Group } from "@mantine/core";
import { FC } from "react";
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
  const { user } = useAuth0();
  const currentUserEmail = user?.email;

  const rows = (roles || []).map((role) => {
    const thatsMe = role.email === currentUserEmail;

    const isALeader = role.role === "TEAM_LEADER";

    const roleInTeam = isALeader ? "LEAD" : "MEMBER";

    return (
      <tr key={role.createdAt}>
        <td>{role.email}</td>
        {thatsMe ? (
          <td></td>
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
          <Group>
            {!thatsMe && (
              <Button onClick={() => onRemove?.(role.email)} color="red">
                Remove
              </Button>
            )}
            {!thatsMe && !isALeader && (
              <Button onClick={() => makeALeader?.(role.email)} color="green">
                Make a leader
              </Button>
            )}
            {!thatsMe && isALeader && (
              <Button
                onClick={() => removeLeaderRole?.(role.email)}
                color="red"
              >
                Remove leadership
              </Button>
            )}
          </Group>
        </td>
      </tr>
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
