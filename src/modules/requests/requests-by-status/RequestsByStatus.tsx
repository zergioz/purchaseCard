import React, { useEffect, useContext, useState } from "react";
import { Filters } from "../../../components/filters/Filters";
import { RequestTable } from "../../../components/request-table/RequestTable";
import { StatusFilter } from "../../../components/filters/StatusFilter";
import RequestContext from "../../../contexts/RequestContext";
import { Request } from "../../../services/models/Request";
import { RequestService } from "../../../services";

interface IProps {
  status: string;
}

export const RequestsByStatus: React.FC<IProps> = props => {
  const context = useContext(RequestContext);
  const [filtered, setFiltered] = useState<Request[]>([]);
  const [status, setStatus] = useState<string>(props.status);
  const defaultFilters = new Filters();

  useEffect(() => {
    const svc = new RequestService();
    context.subscribeTo(svc.read());
  }, []);

  useEffect(() => {
    setFiltered(context.applyFilters(defaultFilters, false));
  }, [context.requests]);

  useEffect(() => {
    setStatus(props.status);
  }, [props.status]);

  return (
    <React.Fragment>
      <h1>Requests by Status</h1>
      <hr />
      <StatusFilter showBadgesFor={filtered} selected={status} />
      <br />
      <RequestTable />
    </React.Fragment>
  );
};
