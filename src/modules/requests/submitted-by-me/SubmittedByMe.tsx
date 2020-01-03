import React, { useContext, useEffect } from "react";
import { Filters } from "../../../components/filters/Filters";
import UserContext from "../../../contexts/UserContext";
import { RequestTable } from "../../../components/request-table/RequestTable";
import RequestContext from "../../../contexts/RequestContext";
import { RequestService } from "../../../services";
import { FilterControls } from "../../../components/filters/FilterControls";

export const SubmittedByMe: React.FC = () => {
  const { user } = useContext(UserContext);
  const context = useContext(RequestContext);
  const defaultFilters = new Filters();

  useEffect(() => {
    const svc = new RequestService();
    context.subscribeTo(svc.read());
  }, []);

  useEffect(() => {
    defaultFilters.requestor = user ? user.LoginName : "";
    defaultFilters.status = "Submitted";
    context.applyFilters(defaultFilters, true);
  }, [user, context.requests]);

  return (
    <React.Fragment>
      <FilterControls />
      <RequestTable />
    </React.Fragment>
  );
};
