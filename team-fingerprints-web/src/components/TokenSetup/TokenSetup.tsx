import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { FC, useEffect, useState } from "react";

export const TokenSetup: FC = ({ children }) => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [tokenPresent, setTokenPresent] = useState(false);

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
          setTokenPresent(true);
          createProfile(token);
        })
        .catch((e) => console.warn(e));
    }
  }, [getAccessTokenSilently, isAuthenticated]);

  return tokenPresent ? <>{children}</> : <>Getting Token</>;
};

export default TokenSetup;
