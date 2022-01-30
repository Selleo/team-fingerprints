import { Button, Table } from "@mantine/core";
import React, { FC } from "react";

interface IProps {
  list?: string[];
  onRemove?: (email: string) => void;
}

const EmailWhitelist: FC<IProps> = ({ list, onRemove }) => {
  const rows = (list || []).map((email) => {
    return (
      <tr key={email}>
        <td>{email}</td>
        <td>
          <Button onClick={() => onRemove?.(email)} color="red">
            Remove
          </Button>
        </td>
      </tr>
    );
  });

  return (
    <Table>
      <thead>
        <tr>
          <th>Whitelisted Emails</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
};

export default EmailWhitelist;
