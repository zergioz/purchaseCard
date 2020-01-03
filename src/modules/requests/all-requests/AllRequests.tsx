import React, { useEffect, useContext, useState } from "react";
import { Filters } from "../../../components/filters/Filters";
import { RequestTable } from "../../../components/request-table/RequestTable";
import { StatusFilter } from "../../../components/filters/StatusFilter";
import { DirectorateFilter } from "../../../components/filters/DirectorateFilter";
import RequestContext from "../../../contexts/RequestContext";
import { RequestService } from "../../../services";

export const AllRequests: React.FC = () => {
  const context = useContext(RequestContext);

  useEffect(() => {
    const svc = new RequestService();
    context.subscribeTo(svc.read());
  }, []);

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
