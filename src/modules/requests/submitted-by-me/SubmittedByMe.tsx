import React, { useContext, useState, useMemo, useEffect } from "react";
import { Filters } from "../../../components/filters/Filters";
import UserContext from "../../../contexts/UserContext";
import { RequestTable } from "../../../components/request-table/RequestTable";
import { StatusFilter } from "../../../components/filters/StatusFilter";
import RequestContext from "../../../contexts/RequestContext";
import { RequestService } from "../../../services";
import { Request } from "../../../services/models/Request";

export const SubmittedByMe: React.FC = () => {
  const { user } = useContext(UserContext);
  const context = useContext(RequestContext);
  const [filtered, setFiltered] = useState<Request[]>([]);
  const defaultFilters = new Filters();

  useEffect(() => {
    const svc = new RequestService();
    context.subscribeTo(svc.read());
  }, []);

  useEffect(() => {
    defaultFilters.requestor = user ? user.LoginName : "";
    console.log(`SubmByMea applying filters`);
    setFiltered(context.applyFilters(defaultFilters));
  }, [context.requests, user]);

  return (
    <React.Fragment>
      <h1>Submitted by Me</h1>
      <hr />
      <StatusFilter showBadgesFor={filtered} />
      <br />
      <RequestTable />
    </React.Fragment>
  );
};
