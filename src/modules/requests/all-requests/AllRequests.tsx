import React, { useEffect, useContext, useState } from "react";
import { Filters } from "../../../components/filters/Filters";
import { RequestTable } from "../../../components/request-table/RequestTable";
import { StatusFilter } from "../../../components/filters/StatusFilter";
import { DirectorateFilter } from "../../../components/filters/DirectorateFilter";
import RequestContext from "../../../contexts/RequestContext";
import { RequestService } from "../../../services";

export const AllRequests: React.FC = () => {
  const context = useContext(RequestContext);
  const filters = new Filters();

  useEffect(() => {
    const svc = new RequestService();
    context.subscribeTo(svc.read());
  }, []);

  useEffect(() => {
    context.applyFilters(filters, true);
  }, [context.requests]);

  return (
    <React.Fragment>
      <h1>All Requests</h1>
      <hr />
      <DirectorateFilter />
      <br />
      <StatusFilter />
      <RequestTable />
    </React.Fragment>
  );
};
