import { AppState, Auth0Provider } from "@auth0/auth0-react";
import { QueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import LoginGateway from "./LoginGateway";

import "./styles/application.sass";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  const navigate = useNavigate();
  const onRedirectCallback = (appState: AppState) => {
    if (appState?.returnTo) {
      navigate(appState.returnTo);
    }
  };

  return (
    <div className="app">
      <Auth0Provider
        domain={process.env.REACT_APP_AUTH0_DOMAIN as string}
        clientId={process.env.REACT_APP_AUTH0_CLIENT_ID as string}
        redirectUri={window.location.origin}
        scope="read"
        audience={process.env.REACT_APP_AUTH0_AUDIENCE}
        useRefreshTokens
        cacheLocation="localstorage"
        onRedirectCallback={onRedirectCallback}
      >
        <LoginGateway />
      </Auth0Provider>
    </div>
  );
};

export default App;
