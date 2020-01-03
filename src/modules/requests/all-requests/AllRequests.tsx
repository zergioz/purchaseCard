import React, { useEffect, useContext } from "react";
import { RequestTable } from "../../../components/request-table/RequestTable";
import { StatusFilter } from "../../../components/filters/StatusFilter";
import { DirectorateFilter } from "../../../components/filters/DirectorateFilter";
import RequestContext from "../../../contexts/RequestContext";
import { RequestService } from "../../../services";
import { Filters } from "../../../components/filters/Filters";

export const AllRequests: React.FC = () => {
  const context = useContext(RequestContext);
  const defaultFilters = new Filters();

  useEffect(() => {
    const svc = new RequestService();
    context.subscribeTo(svc.read());
  }, []);

  useEffect(() => {
    defaultFilters.status = "Submitted";
    context.applyFilters(defaultFilters, true);
  }, [context.requests]);

  return (
    <React.Fragment>
      <h1>All Requests</h1>
      <hr />
      <div className="container-fluid grey">
        <DirectorateFilter />
        <br />
        <StatusFilter />
      </div>
      <RequestTable />
    </React.Fragment>
  );
};
