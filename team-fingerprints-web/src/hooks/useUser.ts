import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { Profile } from "../types/models";
import { useNavigate } from "react-router-dom";

const useUser = () => {
  const { user, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  const { data, refetch } = useQuery<Profile>(
    "profileData",
    async () => {
      const response = await axios.get<Profile>("/auth/profile");
      return response.data;
    },
    {
      refetchOnWindowFocus: false,
      enabled: false,
    }
  );

  useEffect(() => {
    if (isAuthenticated) {
      refetch().then((data) => {
        if (data.data?.canCreateTeam) {
          navigate("companies/new");
        }
      });
    }
  }, [isAuthenticated]);

  return { user, profile: data, isAuthenticated };
};

export default useUser;
