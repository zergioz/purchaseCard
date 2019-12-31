import React, { useContext } from "react";
import { RequestTableFiltered } from "../../components/request-table-filtered/RequestTableFiltered";
import { Filters } from "../../components/requests-filter/Filters";
import UserContext from "../../contexts/UserContext";

export const SubmittedByMe: React.FC = () => {
  const { user } = useContext(UserContext);
  const defaultFilters = new Filters();

  return (
    <React.Fragment>
      <h1>Submitted by Me</h1>
      <hr />
      {user && (
        <RequestTableFiltered
          filters={{ ...defaultFilters, requestor: user.LoginName }}
        />
      )}
    </React.Fragment>
  );
};
