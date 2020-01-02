import React, { useContext } from "react";
import { RequestTableRow } from "./RequestTableRow";
import { Request } from "../../services/models/Request";
import { Table, Alert } from "react-bootstrap";
import RequestContext from "../../contexts/RequestContext";
import { Filters } from "../filters/Filters";
import { Link } from "react-router-dom";

interface IProps {
  items?: Request[];
}
export const RequestTable = (props: IProps) => {
  const context = useContext(RequestContext);
  const items = props.items || context.filteredRequests;

  return (
    <>
      {context.loading && (
        <div className="d-flex justify-content-center m-xl-5">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}

      {!context.loading && (
        <Table striped hover>
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
              <RequestTableRow request={item} key={index}></RequestTableRow>
            ))}
          </tbody>
          <tfoot>
            {items && items.length == 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center" }}>
                  <Alert variant={"warning"}>
                    There are no requests that match your filters.{" "}
                    <Link to="/requests/all-requests" className="alert-link">
                      Reset filters
                    </Link>
                  </Alert>
                </td>
              </tr>
            )}
          </tfoot>
        </Table>
      )}
    </>
  );
};
