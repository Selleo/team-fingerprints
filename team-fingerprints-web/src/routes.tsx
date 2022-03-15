import { Route, Routes } from "react-router-dom";
import Surveys from "./routes/Surveys";
import { AppShell } from "@mantine/core";

import AppNavBar from "./components/AppNavBar";
import AppHeader from "./components/AppHeader";
import SurveyDetails from "./routes/Surveys/Details";
import Responses from "./routes/Responses";
import ResponseEdit from "./routes/Responses/Edit";
import Users from "./routes/Users";
import CompaniesNew from "./routes/Companies/New";
import RoleManagment from "./routes/RoleManagment";

import CompaniesManagment from "./routes/Companies/Managment";
import TeamManagement from "./routes/TeamManagement";
import { Profile } from "./types/models";
import { createContext } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "react-query";
import axios from "axios";
import { queryClient } from "./App";

interface ProfileContextInterface {
  profile: Profile | undefined;
  invalidateProfile: () => void;
}

export const ProfileContext = createContext<ProfileContextInterface>(
  {} as ProfileContextInterface
);

const AppRoutes = () => {
  const { user } = useAuth0();

  const auth0UserId = user?.sub?.split("|")[1];

  const { data, isLoading } = useQuery<Profile>(
    `profileData${auth0UserId}`,
    async () => {
      const response = await axios.get<Profile>("/auth/profile");
      return response.data;
    }
  );

  const invalidateProfile = () => {
    console.log("invalidating");
    queryClient.invalidateQueries(`profileData${auth0UserId}`);
  };

  return (
    <ProfileContext.Provider value={{ profile: data, invalidateProfile }}>
      <AppShell
        // navbarOffsetBreakpoint controls when navbar should no longer be offset with padding-left
        navbarOffsetBreakpoint="sm"
        fixed
        navbar={true ? <AppNavBar /> : undefined}
        header={<AppHeader />}
        className="app-shell"
      >
        {isLoading ? (
          <div>Loading profile data</div>
        ) : (
          <Routes>
            <Route path="/" element={<Surveys />} />
            <Route path="manage" element={<RoleManagment />} />
            <Route path="surveys" element={<Surveys />} />
            <Route path="companies/new" element={<CompaniesNew />} />
            <Route path="companies/:id" element={<CompaniesManagment />} />
            <Route path="companies/:id/team">
              <Route path=":teamId" element={<TeamManagement />} />
            </Route>

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
        )}
      </AppShell>
    </ProfileContext.Provider>
  );
};

export default AppRoutes;
