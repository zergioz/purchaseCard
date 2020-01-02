import React, { useEffect, useContext, useState } from "react";
import { Filters } from "../../../components/filters/Filters";
import { RequestTable } from "../../../components/request-table/RequestTable";
import { StatusFilter } from "../../../components/filters/StatusFilter";
import RequestContext from "../../../contexts/RequestContext";
import { Request } from "../../../services/models/Request";

interface IProps {
  status: string;
}

export const RequestsByStatus: React.FC<IProps> = props => {
  const context = useContext(RequestContext);
  const defaultFilters = new Filters();

  const [filtered, setFiltered] = useState<Request[]>([]);

  useEffect(() => {
    defaultFilters.status = props.status;
    let counts = context.applyFilters(defaultFilters);
    console.log(`RequestsBySta`);
    setFiltered(counts);
  }, [props, context.requests]);

  return (
    <React.Fragment>
      <h1>Requests by Status</h1>
      <hr />
      <StatusFilter requestsToCount={filtered} />
      <br />
      <RequestTable />
    </React.Fragment>
  );
};
