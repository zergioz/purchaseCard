import React from "react";
import { RequestTableFiltered } from "../../components/request-table-filtered/RequestTableFiltered";
import { Filters } from "../../components/requests-filter/Filters";

export const SubmittedByMe: React.FC = () => {
  const defaultFilters = new Filters();
  defaultFilters.requestor = "";

  return (
    <React.Fragment>
      <h1>Submitted by Me</h1>
      <hr />
      <RequestTableFiltered filters={defaultFilters} />
    </React.Fragment>
  );
};
