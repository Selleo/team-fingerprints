import { useAuth0 } from "@auth0/auth0-react";
import { Button, Table, Badge, Group } from "@mantine/core";
import React, { FC } from "react";
import { TeamLead, User } from "../../../types/models";

interface IProps {
  list?: string[];
  onRemove?: (email: string) => void;
  users?: User[];
  teamLeader?: TeamLead;
  makeALeader: (email: string) => void;
  removeLeaderRole: (email: string) => void;
}

const EmailWhitelist: FC<IProps> = ({
  list,
  onRemove,
  users,
  teamLeader,
  makeALeader,
  removeLeaderRole,
}) => {
  const { user } = useAuth0();
  const currentUserEmail = user?.email;

  const rows = (list || []).map((email) => {
    const user = users?.find((el) => el.email === email);
    const thatsMe = email === currentUserEmail;

    const isALeader =
      teamLeader &&
      (user?._id === teamLeader?._id || email === teamLeader?.email);

    const roleInTeam = isALeader ? "LEAD" : "MEMBER";

    return (
      <tr key={email}>
        <td>{email}</td>
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
              <Button onClick={() => onRemove?.(email)} color="red">
                Remove
              </Button>
            )}
            {!thatsMe && !isALeader && (
              <Button onClick={() => makeALeader?.(email)} color="green">
                Make a leader
              </Button>
            )}
            {!thatsMe && isALeader && (
              <Button onClick={() => removeLeaderRole?.(email)} color="red">
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
