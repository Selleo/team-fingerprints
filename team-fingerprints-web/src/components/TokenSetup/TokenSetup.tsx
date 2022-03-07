import { useAuth0 } from "@auth0/auth0-react";
import { FC, useEffect, useState } from "react";

export const TokenSetup: FC = ({ children }) => {
  const { isAuthenticated, getAccessTokenSilently, isLoading } = useAuth0();
  const [tokenPresent, setTokenPresent] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      getAccessTokenSilently({
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
        scope: "read",
      })
        .then((token) => {
          localStorage.setItem("token", token);
          setTokenPresent(true);
        })
        .catch((e) => console.warn(e));
    }
  }, [getAccessTokenSilently, isAuthenticated, isLoading]);

  return tokenPresent ? <>{children}</> : <>Getting Token</>;
};

export default TokenSetup;
