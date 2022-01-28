import { Route, Routes, useNavigate } from "react-router-dom";
import MainRoute from "./routes/MainRoute";
import Surveys from "./routes/Surveys";
import { AppShell } from "@mantine/core";

import AppNavBar from "./components/AppNavBar";
import AppHeader from "./components/AppHeader";
import SurveyDetails from "./routes/Surveys/Details";
import Responses from "./routes/Responses";
import ResponseEdit from "./routes/Responses/Edit";
import Users from "./routes/Users";
import Companies from "./routes/Companies";
import CompaniesNew from "./routes/Companies/New";

import CompaniesManagment from "./routes/Companies/Managment";
import { Profile } from "./types/models";
import { createContext, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "react-query";
import axios from "axios";

interface ProfileContextInterface {
  profile: Profile | undefined;
}

export const ProfileContext = createContext<ProfileContextInterface>(
  {} as ProfileContextInterface
);

const AppRoutes = () => {
  const { user } = useAuth0();
  const navigate = useNavigate();

  const { data, refetch } = useQuery<Profile>(
    `profileData${user?.sub}`,
    async () => {
      const response = await axios.get<Profile>("/auth/profile");
      return response.data;
    },
    {
      refetchOnWindowFocus: false,
      enabled: false,
    }
  );

  useEffect(() => {
    refetch().then((data) => {
      if (data.data?.canCreateTeam) {
        navigate("companies/new");
        return;
      }
      if (data.data?.role === "COMPANY_ADMIN") {
        navigate("companies/managment");
        return;
      }
    });
  }, []);

  const shouldSeeNav = data?.role === "SUPER_ADMIN";

  return (
    <ProfileContext.Provider value={{ profile: data }}>
      <AppShell
        // navbarOffsetBreakpoint controls when navbar should no longer be offset with padding-left
        navbarOffsetBreakpoint="sm"
        fixed
        navbar={shouldSeeNav ? <AppNavBar /> : undefined}
        header={<AppHeader />}
      >
        <Routes>
          <Route path="/" element={<MainRoute />} />
          <Route path="surveys" element={<Surveys />} />
          <Route path="companies" element={<Companies />} />
          <Route path="companies/new" element={<CompaniesNew />} />
          <Route path="companies/managment" element={<CompaniesManagment />} />

          <Route path="users" element={<Users />} />

          <Route path="survey/:id" element={<SurveyDetails />} />
          <Route
            path="*"
            element={
              <main style={{ padding: "1rem" }}>
                <p>There's nothing here!</p>
              </main>
            }
          />
          <Route path="responses" element={<Responses />} />
          <Route path="response/:surveyId" element={<ResponseEdit />} />
        </Routes>
      </AppShell>
    </ProfileContext.Provider>
  );
};

export default AppRoutes;
