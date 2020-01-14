import React, { useContext } from "react";
import { RequestTableRow } from "./RequestTableRow";
import { Request } from "../../services/models/Request";
import { Table } from "react-bootstrap";
import RequestContext from "../../contexts/RequestContext";
import { NoResults } from "./NoResults";
import { LoadingResults } from "./LoadingResults";
import { useRequestFiltering } from "../filters/RequestFilters";
import "./RequestTable.css";
import { RequestService } from "../../services";

interface IProps {
  items?: Request[];
  onRequestUpdated?: (newRequest: Request) => void;
}
export const RequestTable = (props: IProps) => {
  const svc = new RequestService();
  const context = useContext(RequestContext);
  const { applyFilters } = useRequestFiltering();
  const items = props.items || context.filteredRequests;
  const pageItems = applyFilters(context.pageFilters, context.requests);

  const onRequestUpdated = (newRequest: Request) => {
    if (props.onRequestUpdated) props.onRequestUpdated(newRequest);
    //context.subscribeTo(svc.update(newRequest), "update");
  };

  return (
    <>
      {context.loading && <LoadingResults />}
      {!context.loading && items && items.length > 0 && (
        <div className="container-fluid-spacious">
          <div className="row">
            <div className="col-md-12 text-center">
              <small className="text-secondary">{`Showing ${items.length} of ${pageItems.length} requests`}</small>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <Table striped hover style={{ marginTop: "5px" }}>
                <thead>
                  <tr>
                    <th className="action-button-col"></th>
                    <th className="text-center">Directorate</th>
                    <th>Requestor/Cardholder</th>
                    <th>FY/Qt</th>
                    <th>Justification</th>
                    <th>Submitted</th>
                  </tr>
                </thead>
                <tbody id="requestList">
                  {items.map((item: Request, index: number) => (
                    <RequestTableRow
                      request={item}
                      key={index}
                      onRequestUpdated={onRequestUpdated}
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
