import { useState } from "react";
import { User } from "../types/models";

const useUser = () => {
  const [user, setUser] = useState<User>({
    _id: "61cb1a5b539d8e70c705f1f9",
    firstName: "Test",
    lastName: "User",
    email: "test@selleo.com",
  });

  return { user, setUser };
};

export default useUser;
