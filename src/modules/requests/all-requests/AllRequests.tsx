import React, { useEffect, useContext } from "react";
import { RequestTable } from "../../../components/request-table/RequestTable";
import RequestContext from "../../../contexts/RequestContext";
import { RequestService } from "../../../services";
import { Filters } from "../../../components/filters/Filters";
import { FilterControls } from "../../../components/filters/FilterControls";

export const AllRequests: React.FC = () => {
  const context = useContext(RequestContext);
  const defaultFilters = new Filters();

  useEffect(() => {
    const svc = new RequestService();
    context.subscribeTo(svc.read());
  }, []);

  useEffect(() => {
    context.applyFilters(defaultFilters, true);
  }, [context.requests]);

  return (
    <React.Fragment>
      <FilterControls />
      <RequestTable />
    </React.Fragment>
  );
};
