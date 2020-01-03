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
  const defaultFilters = new Filters();

  useEffect(() => {
    const svc = new RequestService();
    context.subscribeTo(svc.read());
  }, []);

  useEffect(() => {
    console.log(`RequestsBySta applying filters`);
    setFiltered(context.applyFilters(defaultFilters));
  }, [props.status, context.requests]);

  return (
    <React.Fragment>
      <h1>Requests by Status</h1>
      <hr />
      <StatusFilter showBadgesFor={filtered} defaultFilter={props.status} />
      <br />
      <RequestTable />
    </React.Fragment>
  );
};
