import React, { useEffect, useContext } from "react";
import { Filters } from "../../../components/filters/Filters";
import { RequestTable } from "../../../components/request-table/RequestTable";
import { StatusFilter } from "../../../components/filters/StatusFilter";
import RequestContext from "../../../contexts/RequestContext";

interface IProps {
  status: string;
}

export const RequestsByStatus: React.FC<IProps> = props => {
  const context = useContext(RequestContext);
  const defaultFilters = new Filters();

  useEffect(() => {
    defaultFilters.status = props.status;
    context.applyFilters(defaultFilters);
  }, [props, context.requests]);

  return (
    <React.Fragment>
      <h1>Requests by Status</h1>
      <hr />
      <StatusFilter />
      <br />
      <RequestTable />
    </React.Fragment>
  );
};
