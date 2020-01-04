import React, { useContext } from "react";
import { RequestTableRow } from "./RequestTableRow";
import { Request } from "../../services/models/Request";
import { Table } from "react-bootstrap";
import RequestContext from "../../contexts/RequestContext";
import { NoResults } from "./NoResults";
import { LoadingResults } from "./LoadingResults";

interface IProps {
  items?: Request[];
}
export const RequestTable = (props: IProps) => {
  const context = useContext(RequestContext);
  const items = props.items || context.filteredRequests;

  return (
    <>
      {context.loading && <LoadingResults />}
      {!context.loading && items && items.length > 0 && (
        <div className="container-fluid-spacious">
          <div className="row">
            <div className="col-md-12 text-center">
              <span>{`Showing ${context.filteredRequests.length} of ${context.requests.length} requests`}</span>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <Table striped hover style={{ marginTop: "5px" }}>
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Requestor</th>
                    <th>Directorate</th>
                    <th>FY</th>
                    <th>Qt</th>
                    <th>Justification</th>
                    <th>Status</th>
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
