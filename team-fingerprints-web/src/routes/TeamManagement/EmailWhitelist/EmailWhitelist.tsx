import { useAuth0 } from "@auth0/auth0-react";
import { Button, Table, Badge, Group } from "@mantine/core";
import React, { FC } from "react";
import { User } from "../../../types/models";

interface IProps {
  list?: string[];
  onRemove?: (email: string) => void;
  users?: User[];
  teamLeader?: string;
  makeALeader: (email: string) => void;
}

const EmailWhitelist: FC<IProps> = ({
  list,
  onRemove,
  users,
  teamLeader,
  makeALeader,
}) => {
  const { user } = useAuth0();
  const userEmail = user?.email;

  const rows = (list || []).map((email) => {
    const user = users?.find((el) => el.email === email);
    const thatsMe = user?.email === userEmail;
    const isALeader = user?._id === teamLeader;

    return (
      <tr key={email}>
        <td>{email}</td>
        {thatsMe ? (
          <td></td>
        ) : (
          <td>
            {user ? <Badge>{isALeader ? "LEAD" : "MEMBER"}</Badge> : "Pending"}
          </td>
        )}
        <td>
          <Group>
            {!thatsMe && (
              <Button onClick={() => onRemove?.(email)} color="red">
                Remove
              </Button>
            )}
            {!thatsMe && (
              <Button onClick={() => makeALeader?.(email)} color="green">
                Make a leader
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
