import React, { useContext, useEffect } from "react";
import { RequestFilters } from "../../../components/filters/RequestFilters";
import RequestContext from "../../../contexts/RequestContext";
import { RequestService } from "../../../services";
import { RequestFiltersContainer } from "../../../components/request-filters-container/RequestFiltersContainer";
import { RequestTable } from "../../../components/request-table/RequestTable";
import { DirectorateTable } from "../../../components/directorate-table/DirectorateTable";

interface IProps {
  directorate: string;
}
export const RequestsByDirectorate: React.FC<IProps> = props => {
  const context = useContext(RequestContext);
  const defaultFilters = new RequestFilters();

  //get data on mount
  useEffect(() => {
    const svc = new RequestService();
    context.subscribeTo(svc.read());
  }, []);

  //when the data comes back or the directorate changes, refilter
  useEffect(() => {
    defaultFilters.directorate = props.directorate;
    context.updatePageFilters(defaultFilters);
    context.applyFilters(defaultFilters, true);
  }, [props.directorate, context.requests]);

  return (
    <React.Fragment>
      {props.directorate && (
        <>
          <RequestFiltersContainer hide={["DirectorateFilter"]} />
          <RequestTable />
        </>
      )}
      {!props.directorate && (
        <div className="container">
          <div className="row">
            <div className="col-12 mb-4 text-center">
              <h2>Requests by Directorate</h2>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <DirectorateTable />
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};
