import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

export const TokenSetup = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      getAccessTokenSilently({
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
        scope: "read",
      })
        .then((token) => {
          localStorage.setItem("token", token);
        })
        .catch((e) => console.warn(e));
    } else {
      localStorage.removeItem("token");
    }
  }, [getAccessTokenSilently, isAuthenticated]);

  return null;
};

export default TokenSetup;
