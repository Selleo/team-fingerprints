import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useEffect } from "react";

export const TokenSetup = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  const createProfile = (token: string) => {
    axios.post("/auth", {}, { headers: { Authorization: `Bearer ${token}` } });
  };

  useEffect(() => {
    if (isAuthenticated) {
      getAccessTokenSilently({
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
        scope: "read",
      })
        .then((token) => {
          localStorage.setItem("token", token);
          createProfile(token);
        })
        .catch((e) => console.warn(e));
    } else {
      localStorage.removeItem("token");
    }
  }, [getAccessTokenSilently, isAuthenticated]);

  return null;
};

export default TokenSetup;
