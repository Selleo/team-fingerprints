import { useState } from "react";
import { User } from "../types/models";

const useUser = () => {
  const [user, setUser] = useState<User>({
    _id: "61cec1c259f5097fd2836abe",
    firstName: "Test",
    lastName: "User",
    email: "test@selleo.com",
  });

  return { user, setUser };
};

export default useUser;
