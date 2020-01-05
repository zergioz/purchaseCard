import React, { useEffect, useContext } from "react";
import { RequestFilters } from "../../../components/filters/RequestFilters";
import { RequestTable } from "../../../components/request-table/RequestTable";
import RequestContext from "../../../contexts/RequestContext";
import { RequestService } from "../../../services";
import { RequestFiltersContainer } from "../../../components/request-filters-container/RequestFiltersContainer";

interface IProps {
  status: string;
}

export const RequestsByStatus: React.FC<IProps> = props => {
  const context = useContext(RequestContext);
  const defaultFilters = new RequestFilters();

  useEffect(() => {
    const svc = new RequestService();
    context.subscribeTo(svc.read());
  }, []);

  useEffect(() => {
    defaultFilters.status = props.status;
    context.updatePageFilters(defaultFilters);
    context.applyFilters(defaultFilters, true);
  }, [props.status, context.requests]);

  return (
    <React.Fragment>
      <RequestFiltersContainer />
      <RequestTable />
    </React.Fragment>
  );
};
