import { useAuth0 } from "@auth0/auth0-react";
import AppRoutes from "./routes";
import { BrowserRouter } from "react-router-dom";
import {
  Button,
  Center,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { useState } from "react";
import { QueryClientProvider } from "react-query";
import TokenSetup from "./components/TokenSetup";
import { ReactQueryDevtools } from "react-query/devtools";
import { queryClient } from "./App";

const LoginGateway = () => {
  const { isAuthenticated, loginWithRedirect, isLoading } = useAuth0();
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  return (
    <ColorSchemeProvider
      colorScheme={theme}
      toggleColorScheme={() => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
      }}
    >
      <MantineProvider theme={{ colorScheme: theme }} withGlobalStyles>
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
            <Center style={{ width: "100%", height: "1000px" }}>
              <Button size="xl" onClick={() => loginWithRedirect()}>
                {isLoading ? "Loading" : "Login"}
              </Button>
            </Center>
          )}
        </NotificationsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

export default LoginGateway;
