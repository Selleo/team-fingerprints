import { useLocation } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import { QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import ShowPublicResults from "./routes/PublicSurveys/PublicSurveyResults";
import PublicSurveysList from "./routes/PublicSurveys/PublicSurveysList";
import { useAuth0 } from "@auth0/auth0-react";
import { NotificationsProvider } from "@mantine/notifications";
import {
  AppShell,
  Button,
  Center,
  MantineProvider,
  Text,
  Title,
} from "@mantine/core";
import WelcomeScreen from "./WelcomeScreen";

import { ReactComponent as BGIcons } from "./assets/BGIcons.svg";

import { queryClient } from "./App";
import AppRoutes from "./routes";
import TokenSetup from "./components/TokenSetup";

import "./login-gateway.sass";

const LoginGateway = () => {
  const { isAuthenticated, loginWithRedirect, isLoading } = useAuth0();
  const { pathname } = useLocation();

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
              <AppRoutes />
              <ReactQueryDevtools />
            </QueryClientProvider>
          </TokenSetup>
        ) : (
          <>
            <QueryClientProvider client={queryClient}>
              <Routes>
                <Route path="/public" element={<PublicSurveysList />} />
                <Route
                  path="/"
                  element={
                    <WelcomeScreen
                      loginWithRedirect={loginWithRedirect}
                      isLoading={isLoading}
                      pathname={pathname}
                    />
                  }
                />
                <Route
                  path="survey/:surveyId"
                  element={<ShowPublicResults />}
                />
              </Routes>
            </QueryClientProvider>
          </>
        )}
      </NotificationsProvider>
    </MantineProvider>
  );
};

export default LoginGateway;
