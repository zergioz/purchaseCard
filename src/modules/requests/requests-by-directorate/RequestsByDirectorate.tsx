import React, { useContext, useEffect, useState } from "react";
import { Filters } from "../../../components/filters/Filters";
import { RequestTable } from "../../../components/request-table/RequestTable";
import RequestContext from "../../../contexts/RequestContext";
import { StatusFilter } from "../../../components/filters/StatusFilter";
import { RequestService } from "../../../services";

interface IProps {
  directorate: string;
}
export const RequestsByDirectorate: React.FC<IProps> = props => {
  const context = useContext(RequestContext);
  const defaultFilters = new Filters();

  useEffect(() => {
    const svc = new RequestService();
    context.subscribeTo(svc.read());
  }, []);

  useEffect(() => {
    defaultFilters.directorate = props.directorate;
    context.applyFilters(defaultFilters, true);
  }, [props.directorate, context.requests]);

  return (
    <React.Fragment>
      <h1>{`Requests by Directorate (${
        props.directorate ? props.directorate : `All Directorates`
      })`}</h1>
      <hr />
      <StatusFilter />
      <br />
      <RequestTable />
    </React.Fragment>
  );
};
