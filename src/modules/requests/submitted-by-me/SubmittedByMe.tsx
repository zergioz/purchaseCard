import React, { useContext, useState, useMemo, useEffect } from "react";
import { Filters } from "../../../components/filters/Filters";
import UserContext from "../../../contexts/UserContext";
import { RequestTable } from "../../../components/request-table/RequestTable";
import { StatusFilter } from "../../../components/selector-pills/StatusFilter";
import RequestContext from "../../../contexts/RequestContext";

export const SubmittedByMe: React.FC = () => {
  const { user } = useContext(UserContext);
  const context = useContext(RequestContext);
  const defaultFilters = new Filters();

  useEffect(() => {
    defaultFilters.requestor = user ? user.LoginName : "";
    context.applyFilters(defaultFilters);
  }, [user, context.requests]);

  return (
    <React.Fragment>
      <h1>Submitted by Me</h1>
      <hr />
      <StatusFilter />
      <br />
      <RequestTable />
    </React.Fragment>
  );
};
