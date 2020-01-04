import React, { useContext, useEffect } from "react";
import { Filters } from "../../../components/filters/Filters";
import { RequestTable } from "../../../components/request-table/RequestTable";
import RequestContext from "../../../contexts/RequestContext";
import { RequestService } from "../../../services";
import { FilterControls } from "../../../components/filters/FilterControls";

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
      <FilterControls />
      <RequestTable />
    </React.Fragment>
  );
};
