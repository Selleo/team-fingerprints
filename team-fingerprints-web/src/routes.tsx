import { Route, Routes } from "react-router-dom";
import MainRoute from "./routes/MainRoute";
import Surveys from "./routes/Surveys";
import { AppShell } from "@mantine/core";

import AppNavBar from "./components/AppNavBar";
import AppHeader from "./components/AppHeader";
import SurveyDetails from "./routes/Surveys/Details";
import Responses from "./routes/Responses";
import ResponseEdit from "./routes/Responses/Edit";

const AppRoutes = () => {
  return (
    <AppShell
      // navbarOffsetBreakpoint controls when navbar should no longer be offset with padding-left
      navbarOffsetBreakpoint="sm"
      fixed
      navbar={<AppNavBar />}
      header={<AppHeader />}
    >
      <Routes>
        <Route path="/" element={<MainRoute />} />
        <Route path="surveys" element={<Surveys />} />
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
  );
};

export default AppRoutes;
