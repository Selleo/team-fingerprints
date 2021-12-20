import AppRoutes from "./routes";
import { BrowserRouter } from "react-router-dom";
import { ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { useState } from "react";

import { QueryClient, QueryClientProvider, useQuery } from "react-query";

export const queryClient = new QueryClient();

const App = () => {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  return (
    <QueryClientProvider client={queryClient}>
      <ColorSchemeProvider
        colorScheme={theme}
        toggleColorScheme={() => {
          setTheme((prev) => (prev === "dark" ? "light" : "dark"));
        }}
      >
        <MantineProvider theme={{ colorScheme: theme }} withGlobalStyles>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </MantineProvider>
      </ColorSchemeProvider>
    </QueryClientProvider>
  );
};

export default App;
