import AppRoutes from "./routes";
import { BrowserRouter } from "react-router-dom";
import { ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { useState } from "react";
import { Auth0Provider } from "@auth0/auth0-react";
import { QueryClient, QueryClientProvider } from "react-query";
import TokenSetup from "./components/TokenSetup";

export const queryClient = new QueryClient();

const App = () => {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  return (
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN as string}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID as string}
      redirectUri={window.location.origin}
      scope="read"
      audience={process.env.REACT_APP_AUTH0_AUDIENCE}
    >
      <TokenSetup />
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
    </Auth0Provider>
  );
};

export default App;
