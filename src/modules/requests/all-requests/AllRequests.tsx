import React, { useEffect, useContext, useState } from "react";
import { Filters } from "../../../components/filters/Filters";
import { RequestTable } from "../../../components/request-table/RequestTable";
import { StatusFilter } from "../../../components/filters/StatusFilter";
import { DirectorateFilter } from "../../../components/filters/DirectorateFilter";
import RequestContext from "../../../contexts/RequestContext";
import { Request } from "../../../services/models/Request";

export const AllRequests: React.FC = () => {
  const context = useContext(RequestContext);
  const defaultFilters = new Filters();

  const [filtered, setFiltered] = useState<Request[]>([]);

  useEffect(() => {
    setFiltered(context.applyFilters(defaultFilters));
  }, []);

  return (
    <React.Fragment>
      <h1>All Requests</h1>
      <hr />
      <DirectorateFilter />
      <br />
      <StatusFilter requestsToCount={filtered} />
      <RequestTable />
    </React.Fragment>
  );
};
