import { Button, Group, TextInput, Title } from "@mantine/core";
import { useNotifications } from "@mantine/notifications";
import axios from "axios";
import React, { useState } from "react";
import { useMutation } from "react-query";
import useDefaultErrorHandler from "../../hooks/useDefaultErrorHandler";

export const UserManagment = () => {
  const [email, setEmail] = useState("");
  const { onErrorWithTitle } = useDefaultErrorHandler();
  const { showNotification } = useNotifications();

  const mutation = useMutation(
    async (email: string) => {
      return axios.delete(`/users`, { data: { email } });
    },
    {
      onSuccess: () => {
        showNotification({ title: "Removed!", message: email });
        setEmail("");
      },
      onError: onErrorWithTitle("Can not delete trend"),
    }
  );

  return (
    <Group>
      <Title>Remove user by email</Title>
      <TextInput
        placeholder="Email to remove"
        onChange={(e) => setEmail(e.currentTarget.value as any)}
        value={email}
      ></TextInput>
      <Button onClick={() => mutation.mutate(email)} color="red">
        Remove User
      </Button>
    </Group>
  );
};

export default UserManagment;
