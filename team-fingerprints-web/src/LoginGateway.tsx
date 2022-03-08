import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { useAuth0 } from "@auth0/auth0-react";
import { NotificationsProvider } from "@mantine/notifications";
import { Button, Center, MantineProvider, Text, Title } from "@mantine/core";

import { ReactComponent as BGIcons } from "./assets/BGIcons.svg";

import { queryClient } from "./App";
import AppRoutes from "./routes";
import TokenSetup from "./components/TokenSetup";

import "./login-gateway.sass";

const LoginGateway = () => {
  const { isAuthenticated, loginWithRedirect, isLoading } = useAuth0();

  return (
    <MantineProvider
      theme={{
        colorScheme: "dark",
        colors: {
          // override dark colors here to change them for all components
          dark: [
            "#ffffffa3",
            "#acaebf",
            "#8c8fa3",
            "#666980",
            "#4d4f66",
            "#34354a",
            "#2b2c3d",
            "#121212",
            "#0c0d21",
            "#01010a",
          ],
        },
      }}
      withGlobalStyles
    >
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
          <>
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
                onClick={() =>
                  loginWithRedirect({
                    connection: "google-oauth2",
                  })
                }
              >
                {isLoading ? "Loading" : "Log in"}
              </Button>
            </Center>
            <div className="svg-background">
              <BGIcons />
            </div>
          </>
        )}
      </NotificationsProvider>
    </MantineProvider>
  );
};

export default LoginGateway;
