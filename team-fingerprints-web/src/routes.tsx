import { Route, Routes } from "react-router-dom";
import MainRoute from "./routes/MainRoute";
import Surveys from "./routes/Surveys";
import { AppShell } from "@mantine/core";

import AppNavBar from "./components/AppNavBar";
import AppHeader from "./components/AppHeader";

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
      </Routes>
    </AppShell>
  );
};

export default AppRoutes;
