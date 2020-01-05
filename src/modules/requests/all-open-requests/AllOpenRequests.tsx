import React, { useEffect, useContext } from "react";
import { RequestTable } from "../../../components/request-table/RequestTable";
import RequestContext from "../../../contexts/RequestContext";
import { RequestService } from "../../../services";
import { RequestFilters } from "../../../components/filters/RequestFilters";
import { RequestFiltersContainer } from "../../../components/request-filters-container/RequestFiltersContainer";

export const AllOpenRequests: React.FC = () => {
  const context = useContext(RequestContext);
  const defaultFilters = new RequestFilters();

  useEffect(() => {
    const svc = new RequestService();
    context.subscribeTo(svc.read());
  }, []);

  useEffect(() => {
    context.updatePageFilters(defaultFilters);
    context.applyFilters(defaultFilters, true);
  }, [context.requests]);

  return (
    <React.Fragment>
      <RequestFiltersContainer />
      <RequestTable />
    </React.Fragment>
  );
};
