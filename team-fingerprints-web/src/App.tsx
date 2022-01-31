import { Auth0Provider } from "@auth0/auth0-react";
import { QueryClient } from "react-query";
import LoginGateway from "./LoginGateway";

export const queryClient = new QueryClient();

const App = () => {
  return (
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN as string}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID as string}
      redirectUri={window.location.origin}
      scope="read"
      audience={process.env.REACT_APP_AUTH0_AUDIENCE}
      useRefreshTokens
      cacheLocation="localstorage"
    >
      <LoginGateway />
    </Auth0Provider>
  );
};

export default App;
