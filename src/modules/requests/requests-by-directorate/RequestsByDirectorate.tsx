import React, { useContext, useEffect, useState } from "react";
import { Filters } from "../../../components/filters/Filters";
import { RequestTable } from "../../../components/request-table/RequestTable";
import RequestContext from "../../../contexts/RequestContext";
import { StatusFilter } from "../../../components/filters/StatusFilter";
import { Request } from "../../../services/models/Request";
import { RequestService } from "../../../services";

interface IProps {
  directorate: string;
}
export const RequestsByDirectorate: React.FC<IProps> = props => {
  const context = useContext(RequestContext);
  const [filtered, setFiltered] = useState<Request[]>([]);
  const defaultFilters = new Filters();
  defaultFilters.directorate = props.directorate;

  useEffect(() => {
    const svc = new RequestService();
    const obs = svc.read();
    context.subscribeTo(obs);
  }, []);

  useEffect(() => {
    console.log(`ReqByDir applying filters`);
    setFiltered(context.applyFilters(defaultFilters));
  }, [props.directorate, context.requests]);

  return (
    <React.Fragment>
      <h1>{`Requests by Directorate (${
        props.directorate ? props.directorate : `All Directorates`
      })`}</h1>
      <hr />
      <StatusFilter showBadgesFor={filtered} defaultFilter="Submitted" />
      <br />
      <RequestTable />
    </React.Fragment>
  );
};
