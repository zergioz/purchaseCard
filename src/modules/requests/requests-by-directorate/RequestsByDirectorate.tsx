import React, { useContext, useEffect, useState } from "react";
import { Filters } from "../../../components/filters/Filters";
import { RequestTable } from "../../../components/request-table/RequestTable";
import RequestContext from "../../../contexts/RequestContext";
import { SelectorPills } from "../../../components/selector-pills/SelectorPills";
import { Request } from "../../../services/models/Request";

interface IProps {
  directorate: string;
}
export const RequestsByDirectorate: React.FC<IProps> = props => {
  const context = useContext(RequestContext);
  const defaultFilters = new Filters();

  const [filtered, setFiltered] = useState<Request[]>([]);

  useEffect(() => {
    defaultFilters.directorate = props.directorate;
    let filtered = context.applyFilters(defaultFilters);
    setFiltered(filtered);
  }, [props, context.requests]);

  return (
    <React.Fragment>
      <h1>{`Requests by Directorate (${
        props.directorate ? props.directorate : `All Directorates`
      })`}</h1>
      <hr />
      <SelectorPills requestsToCount={filtered} />
      <br />
      <RequestTable />
    </React.Fragment>
  );
};
