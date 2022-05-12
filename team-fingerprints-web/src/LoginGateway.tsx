import { Route, Routes } from "react-router-dom";
import { QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import { useAuth0 } from "@auth0/auth0-react";
import { NotificationsProvider } from "@mantine/notifications";
import { MantineProvider } from "@mantine/core";
import WelcomeScreen from "./WelcomeScreen";
import { queryClient } from "./App";
import AppRoutes from "./routes";
import TokenSetup from "./components/TokenSetup";

import "./login-gateway.sass";

import AnimationMember from "./routes/Animation/AnimationMember";
import AnimationLeader from "./routes/Animation/AnimationLeader";
import ShowPublicResults from "./routes/PublicSurveys/PublicSurveyResults";
import PublicSurveysList from "./routes/PublicSurveys/PublicSurveysList";
import LandingPage from "./routes/LandingPage";

const LoginGateway = () => {
  const { isAuthenticated, isLoading } = useAuth0();

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
                <Route path="/" element={<WelcomeScreen />} />
                <Route
                  path="survey/:surveyId"
                  element={<ShowPublicResults />}
                />
                <Route path="/intro/member" element={<AnimationMember />} />
                <Route path="/intro/leader" element={<AnimationLeader />} />
                <Route path="/landing" element={<LandingPage />} />
              </Routes>
            </QueryClientProvider>
          </>
        )}
      </NotificationsProvider>
    </MantineProvider>
  );
};

export default LoginGateway;
