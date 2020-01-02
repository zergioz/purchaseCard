import React, { useEffect, useContext } from "react";
import { Filters } from "../../../components/requests-filter/Filters";
import { RequestTable } from "../../../components/request-table/RequestTable";
import { SelectorPills } from "../../../components/selector-pills/SelectorPills";
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
      <SelectorPills />
      <br />
      <RequestTable />
    </React.Fragment>
  );
};
