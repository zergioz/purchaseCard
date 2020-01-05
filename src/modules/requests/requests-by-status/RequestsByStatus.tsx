import React, { useEffect, useContext } from "react";
import { RequestFilters } from "../../../components/filters/RequestFilters";
import { RequestTable } from "../../../components/request-table/RequestTable";
import RequestContext from "../../../contexts/RequestContext";
import { RequestService } from "../../../services";
import { RequestFiltersContainer } from "../../../components/request-filters-container/RequestFiltersContainer";
import { StatusTable } from "../../../components/status-table/StatusTable";

interface IProps {
  status: string;
}

export const RequestsByStatus: React.FC<IProps> = props => {
  const context = useContext(RequestContext);
  const defaultFilters = new RequestFilters();

  useEffect(() => {
    const svc = new RequestService();
    context.subscribeTo(svc.read());
  }, []);

  useEffect(() => {
    defaultFilters.status = props.status;
    context.updatePageFilters(defaultFilters);
    context.applyFilters(defaultFilters, true);
  }, [props.status, context.requests]);

  return (
    <React.Fragment>
      <div className={`container${props.status && `-fluid-spacious`}`}>
        <div className="row">
          <div className="col-12 mb-4 text-center">
            <h2>Requests by Status {props.status && `(${props.status})`}</h2>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            {props.status && (
              <>
                <RequestFiltersContainer
                  hide={[
                    "StatusFilter",
                    "StatusFilterTabs",
                    "StatusFilterProgressBar"
                  ]}
                />
                <RequestTable />
              </>
            )}
            {!props.status && <StatusTable />}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
