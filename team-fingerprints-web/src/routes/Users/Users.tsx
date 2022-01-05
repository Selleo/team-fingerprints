import { Button } from "@mantine/core";
import axios from "axios";
import React from "react";
import { useMutation } from "react-query";

export default function Users() {
  const mutation = useMutation(async () => {
    return axios.post(`/users`, {
      firstName: "Test",
      lastName: "User",
      email: "test@selleo.com",
    });
  });

  return (
    <div>
      <Button onClick={() => mutation.mutate()} title="Create default User">
        Create default user for useUser hook
      </Button>
      {JSON.stringify(mutation.data)}
    </div>
  );
}
