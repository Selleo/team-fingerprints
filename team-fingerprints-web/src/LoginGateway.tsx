import { useState } from "react";

import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { useAuth0 } from "@auth0/auth0-react";
import { NotificationsProvider } from "@mantine/notifications";
import {
  Button,
  Center,
  ColorSchemeProvider,
  MantineProvider,
  Text,
  Title,
} from "@mantine/core";

import { queryClient } from "./App";
import AppRoutes from "./routes";
import TokenSetup from "./components/TokenSetup";

const LoginGateway = () => {
  const { isAuthenticated, loginWithRedirect, isLoading } = useAuth0();

  return (
    <MantineProvider theme={{ colorScheme: "dark" }} withGlobalStyles>
      <NotificationsProvider>
        {isAuthenticated && !isLoading ? (
          <TokenSetup>
            <QueryClientProvider client={queryClient}>
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
              <ReactQueryDevtools />
            </QueryClientProvider>
          </TokenSetup>
        ) : (
          <Center className="login">
            <Title order={1} className="login__header">
              Welcome to
              <Text className="login__header-span">Selleo Fingerprint</Text>
            </Title>
            <Text className="login__text">
              Find out what the values of employees, companies and teams are.
              Compare charts and data. Create surveys you dream about.
            </Text>
            <Button
              className="login__button"
              onClick={() => loginWithRedirect()}
            >
              {isLoading ? "Loading" : "Log in"}
            </Button>
          </Center>
        )}
      </NotificationsProvider>
    </MantineProvider>
  );
};

export default LoginGateway;
