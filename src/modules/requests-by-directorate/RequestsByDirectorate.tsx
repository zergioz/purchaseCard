import React from "react";
import { RequestTableFiltered } from "../../components/request-table-filtered/RequestTableFiltered";
import { Filters } from "../../components/requests-filter/Filters";

export const RequestsByDirectorate: React.FC = () => {
  return (
    <React.Fragment>
      <h1>Requests by Directorate</h1>
      <hr />
      <RequestTableFiltered filters={new Filters()} />
    </React.Fragment>
  );
};
