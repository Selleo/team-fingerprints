import { Route, Routes } from "react-router-dom";
import Surveys from "./routes/Surveys";
import { AppShell } from "@mantine/core";

import AppHeader from "./components/AppHeader";
import SurveyDetails from "./routes/Surveys/Details";
import Responses from "./routes/Responses";
import ResponseEdit from "./routes/Responses/Edit";
import CompaniesNew from "./routes/Companies/New";
import RoleManagment from "./routes/RoleManagment";
import SurveyResults from "./routes/Companies/Managment/SurveyResults";
import SurveysList from "./routes/Companies/Managment/SurveyResults/SurveysList";
import TeamSurveysList from "./routes/TeamManagement/Management/SurveyResults/SurveysList";
import TeamSurveyResults from "./routes/TeamManagement/Management/SurveyResults";

import CompaniesManagment from "./routes/Companies/Managment";
import TeamManagement from "./routes/TeamManagement";
import { Profile } from "./types/models";
import { createContext } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "react-query";
import axios from "axios";
import { queryClient } from "./App";
import LoadingData from "./components/LoadingData";
import ProfileDetails from "./routes/ProfileDetails";
import UserManagment from "./routes/UserManagment";
import OnboardingProfileModal from "./components/OnboardingProfileModal";

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
    queryClient.invalidateQueries(`profileData${auth0UserId}`);
  };

  return (
    <ProfileContext.Provider value={{ profile: data, invalidateProfile }}>
      <AppShell
        // navbarOffsetBreakpoint controls when navbar should no longer be offset with padding-left
        navbarOffsetBreakpoint="sm"
        fixed
        header={<AppHeader />}
        className="app-shell"
      >
        {isLoading ? (
          <LoadingData />
        ) : (
          <Routes>
            <Route path="/" element={<Responses />} />
            <Route path="manage" element={<RoleManagment />} />
            <Route path="admin">
              <Route path="surveys" element={<Surveys />} />
              <Route path="survey/:id" element={<SurveyDetails />} />
              <Route path="users" element={<UserManagment />} />
            </Route>
            <Route path="profile" element={<ProfileDetails />} />
            <Route path="companies/new" element={<CompaniesNew />} />
            <Route path="companies/:id" element={<CompaniesManagment />} />
            <Route
              path="companies/:companyId/surveys"
              element={<SurveysList />}
            />
            <Route
              path="companies/:companyId/results/:surveyId"
              element={<SurveyResults />}
            />
            <Route path="companies/:companyId/team">
              <Route path=":teamId" element={<TeamManagement />} />
              <Route path=":teamId/surveys" element={<TeamSurveysList />} />
              <Route
                path=":teamId/surveys/:surveyId"
                element={<TeamSurveyResults />}
              />
            </Route>

            <Route
              path="*"
              element={
                <main style={{ padding: "1rem" }}>
                  <p>There's nothing here!</p>
                </main>
              }
            />
            <Route path="response/:surveyId" element={<ResponseEdit />} />
          </Routes>
        )}
      </AppShell>
      <OnboardingProfileModal />
    </ProfileContext.Provider>
  );
};

export default AppRoutes;
