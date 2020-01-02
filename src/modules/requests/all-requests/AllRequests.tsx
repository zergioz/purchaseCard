import React, { useEffect, useContext } from "react";
import { Filters } from "../../../components/filters/Filters";
import { RequestTable } from "../../../components/request-table/RequestTable";
import { StatusFilter } from "../../../components/filters/StatusFilter";
import RequestContext from "../../../contexts/RequestContext";

export const AllRequests: React.FC = () => {
  const context = useContext(RequestContext);
  const defaultFilters = new Filters();

  useEffect(() => {
    context.applyFilters(defaultFilters);
  }, []);

  return (
    <React.Fragment>
      <h1>All Requests</h1>
      <hr />
      <StatusFilter />
      <br />
      <RequestTable />
    </React.Fragment>
  );
};
