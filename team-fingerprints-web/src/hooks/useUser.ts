import { useAuth0 } from "@auth0/auth0-react";

const useUser = () => {
  const { user } = useAuth0();

  return { user };
};

export default useUser;
