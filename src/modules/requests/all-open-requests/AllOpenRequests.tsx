import React, { useEffect, useContext } from "react";
import { RequestTable } from "../../../components/request-table/RequestTable";
import RequestContext from "../../../contexts/RequestContext";
import { RequestService } from "../../../services";
import { RequestFilters } from "../../../components/filters/RequestFilters";
import { RequestFiltersContainer } from "../../../components/request-filters-container/RequestFiltersContainer";
import { areEqual } from "../../../helpers/AreEqual";

export const AllOpenRequests: React.FC = () => {
  const context = useContext(RequestContext);
  const defaultFilters = new RequestFilters();

  useEffect(() => {
    const svc = new RequestService();
    const obs = svc.read();
    context.subscribeTo(obs, "read");
    context.applyFilters(context.filters || defaultFilters, true);
  }, []);

  useEffect(() => {
    context.updatePageFilters(defaultFilters);
    context.applyFilters(context.filters || defaultFilters, false);
  }, [context.requests]);

  return (
    <React.Fragment>
      <div className="container-fluid-spacious">
        <div className="row">
          <div className="col-12 mb-4 text-center">
            <h2>
              All Requests{" "}
              {areEqual(defaultFilters, context.filters) ? "" : "(Filtered)"}
            </h2>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <RequestFiltersContainer
            // hide={["StatusFilterTabs", "StatusFilterProgressBar"]}
            />
            <RequestTable />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
