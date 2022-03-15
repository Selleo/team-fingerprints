import { useAuth0 } from "@auth0/auth0-react";
import { Button, Table, Badge } from "@mantine/core";
import { FC, useContext } from "react";
import { ProfileContext } from "../../routes";
import { CompanyRole } from "../../types/models";

interface IProps {
  onRemove?: (email: string) => void;
  roles: CompanyRole[];
}

const EmailWhitelist: FC<IProps> = ({ onRemove, roles }) => {
  const { profile } = useContext(ProfileContext);

  const rows = roles.map((role) => {
    const thatsMe = role?.userId === profile?.id;

    return (
      <tr key={role.createdAt}>
        <td>{role.email}</td>

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
        <td>
          {thatsMe ? (
            <span>thats you!</span>
          ) : (
            <Button onClick={() => onRemove?.(role.email)} color="red">
              Remove
            </Button>
          )}
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
