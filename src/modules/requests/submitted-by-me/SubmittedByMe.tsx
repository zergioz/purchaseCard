import React, { useContext, useEffect } from "react";
import { RequestFilters } from "../../../components/filters/RequestFilters";
import UserContext from "../../../contexts/UserContext";
import { RequestTable } from "../../../components/request-table/RequestTable";
import RequestContext from "../../../contexts/RequestContext";
import { RequestService } from "../../../services";
import { RequestFiltersContainer } from "../../../components/request-filters-container/RequestFiltersContainer";

export const SubmittedByMe: React.FC = () => {
  const { user } = useContext(UserContext);
  const context = useContext(RequestContext);
  const defaultFilters = new RequestFilters();

  useEffect(() => {
    const svc = new RequestService();
    context.subscribeTo(svc.read());
  }, []);

  useEffect(() => {
    defaultFilters.requestor = user ? user.LoginName : "";
    context.updatePageFilters(defaultFilters);
    context.applyFilters(defaultFilters, true);
  }, [user, context.requests]);

  return (
    <React.Fragment>
      <RequestFiltersContainer />
      <RequestTable />
    </React.Fragment>
  );
};
