import React, { useContext } from "react";
import RoleContext from "../../../contexts/RoleContext";

export const RolesPage: React.FC = () => {
  const roles = useContext(RoleContext);
  return (
    <React.Fragment>
      <h1>Roles</h1>
      <hr />
      <div className="container">
        <div className="row">
          <div className="col-12">
            <pre style={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}>
              {JSON.stringify(roles, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
