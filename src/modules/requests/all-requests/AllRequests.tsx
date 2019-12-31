import React from "react";
import { RequestTableFiltered } from "../../../components/request-table-filtered/RequestTableFiltered";
import { Filters } from "../../../components/requests-filter/Filters";

export const AllRequests: React.FC = () => {
  return (
    <React.Fragment>
      <h1>All Requests</h1>
      <hr />
      <RequestTableFiltered filters={new Filters()} />
    </React.Fragment>
  );
};
