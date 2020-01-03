import React, { useEffect, useContext } from "react";
import { Filters } from "../../../components/filters/Filters";
import { RequestTable } from "../../../components/request-table/RequestTable";
import { StatusFilter } from "../../../components/filters/StatusFilter";
import RequestContext from "../../../contexts/RequestContext";
import { RequestService } from "../../../services";
import { DirectorateFilter } from "../../../components/filters/DirectorateFilter";
import { FiscalYearFilter } from "../../../components/filters/FiscalYearFilter";
import { FilterControls } from "../../../components/filters/FilterControls";

interface IProps {
  status: string;
}

export const RequestsByStatus: React.FC<IProps> = props => {
  const context = useContext(RequestContext);
  const defaultFilters = new Filters();

  useEffect(() => {
    const svc = new RequestService();
    context.subscribeTo(svc.read());
  }, []);

  useEffect(() => {
    defaultFilters.status = props.status || "Submitted";
    context.applyFilters(defaultFilters, true);
  }, [props.status, context.requests]);

  return (
    <React.Fragment>
      <FilterControls status={props.status} />
      <RequestTable />
    </React.Fragment>
  );
};
