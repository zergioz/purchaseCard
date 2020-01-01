import React from "react";
import { RequestTableFiltered } from "../../../components/request-table-filtered/RequestTableFiltered";
import { Filters } from "../../../components/requests-filter/Filters";

interface IProps {
  status: string;
}

export const RequestsByStatus: React.FC<IProps> = props => {
  const defaultFilters = new Filters();
  defaultFilters.status = props.status;

  return (
    <React.Fragment>
      <h1>Requests by Status</h1>
      <hr />
      <RequestTableFiltered filters={defaultFilters} />
    </React.Fragment>
  );
};
