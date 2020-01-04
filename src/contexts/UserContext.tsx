import React, { useState } from "react";
import { UserService } from "../services";
import { CurrentSharepointUser } from "../services/models/CurrentSharepointUser";

const svc = new UserService();

export type UserContextType = {
  user: CurrentSharepointUser | null;
};

export const UserContext = React.createContext<UserContextType>({
  user: null
});

export const UserProvider: React.FC = (props: any) => {
  const [user, updateUser] = useState<CurrentSharepointUser | null>(null);

  if (!user) {
    svc.getCurrentUser().subscribe(user => {
      updateUser(user);
    });
  }

  return (
    <UserContext.Provider
      value={{
        user: user
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContext;
