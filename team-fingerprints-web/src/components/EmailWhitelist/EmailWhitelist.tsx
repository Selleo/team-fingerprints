import { Button, Table, Badge } from "@mantine/core";
import { groupBy, keys, map } from "lodash";
import { FC, useContext } from "react";
import { ProfileContext } from "../../routes";
import { CompanyRole, Team } from "../../types/models";

interface IProps {
  onRemove?: (email: string) => void;
  roles: CompanyRole[];
  teams?: Team[];
}

const EmailWhitelist: FC<IProps> = ({ onRemove, roles, teams }) => {
  const { profile } = useContext(ProfileContext);
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
                  <span>thats you!</span>
                ) : (
                  <Button onClick={() => onRemove?.(role._id)} color="red">
                    Remove
                  </Button>
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
