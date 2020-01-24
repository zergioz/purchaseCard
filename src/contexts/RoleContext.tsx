import React, { useState } from "react";
import { RoleService } from "../services/RoleService";
import { Role } from "../services/models/Role";

const svc = new RoleService();

export type RoleContextType = {
  roles: Role[];
};

export const RoleContext = React.createContext<RoleContextType>({
  roles: []
});

export const RoleProvider: React.FC = (props: any) => {
  const [roles, updateRoles] = useState<Role[]>([]);

  if (!roles) {
    svc.read().subscribe(response => {
      updateRoles(response);
    });
  }

  return (
    <RoleContext.Provider
      value={{
        roles: roles
      }}
    >
      {props.children}
    </RoleContext.Provider>
  );
};

export default RoleContext;
