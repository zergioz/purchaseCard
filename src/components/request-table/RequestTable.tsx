import React, { useContext } from "react";
import { RequestTableRow } from "./RequestTableRow";
import { Request } from "../../services/models/Request";
import { Table } from "react-bootstrap";
import RequestContext from "../../contexts/RequestContext";
import { NoResults } from "./NoResults";
import { LoadingResults } from "./LoadingResults";
import { useRequestFiltering } from "../filters/RequestFilters";
import { ApprovalActionBadge } from "../approval-action-badge/ApprovalActionBadge";

interface IProps {
  items?: Request[];
}
export const RequestTable = (props: IProps) => {
  const context = useContext(RequestContext);
  const { applyFilters } = useRequestFiltering();
  const items = props.items || context.filteredRequests;
  const pageItems = applyFilters(context.pageFilters, context.requests);

  return (
    <>
      {context.loading && <LoadingResults />}
      {!context.loading && items && items.length > 0 && (
        <div className="container-fluid-spacious">
          <div className="row">
            <div className="col-md-12 text-center">
              <span>{`Showing ${items.length} of ${pageItems.length} requests`}</span>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <Table striped hover style={{ marginTop: "5px" }}>
                <thead>
                  <tr>
                    <th></th>
                    <th>Directorate</th>
                    <th>Requestor</th>
                    <th>Cardholder</th>
                    <th>FY</th>
                    <th>Qt</th>
                    <th>Justification</th>
                    <th>Submitted</th>
                  </tr>
                </thead>
                <tbody id="requestList">
                  {items.map((item: Request, index: number) => (
                    <RequestTableRow
                      request={item}
                      key={index}
                    ></RequestTableRow>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      )}
      {!context.loading && items && items.length == 0 && <NoResults />}
    </>
  );
};
