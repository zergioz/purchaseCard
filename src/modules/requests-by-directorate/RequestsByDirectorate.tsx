import React from "react";
import { RequestTableFiltered } from "../../components/request-table-filtered/RequestTableFiltered";
import { Filters } from "../../components/requests-filter/Filters";

export const RequestsByDirectorate: React.FC = () => {
  const defaultFilters = new Filters();
  defaultFilters.directorate = "J6";

  return (
    <React.Fragment>
      <h1>Requests by Directorate</h1>
      <hr />
      <RequestTableFiltered filters={defaultFilters} />
    </React.Fragment>
  );
};
