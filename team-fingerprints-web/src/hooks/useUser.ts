import { useAuth0 } from "@auth0/auth0-react";

const useUser = () => {
  const { user } = useAuth0();
  console.log(user);
  return { user };
};

export default useUser;
