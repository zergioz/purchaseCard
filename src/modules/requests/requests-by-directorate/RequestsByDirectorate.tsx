import React from "react";
import { RequestTableFiltered } from "../../../components/request-table-filtered/RequestTableFiltered";
import { Filters } from "../../../components/requests-filter/Filters";

interface IProps {
  directorate: string;
}
export const RequestsByDirectorate: React.FC<IProps> = props => {
  const defaultFilters = new Filters();
  defaultFilters.directorate = props.directorate;

  const title = "Requests by Directorate";
  return (
    <React.Fragment>
      <h1>{props.directorate ? props.directorate : title}</h1>
      <hr />
      <RequestTableFiltered filters={defaultFilters} />
    </React.Fragment>
  );
};
