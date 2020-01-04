import React, { useContext, useEffect } from "react";
import { RequestTableRow } from "./RequestTableRow";
import { Request } from "../../services/models/Request";
import { Table, Alert, Spinner } from "react-bootstrap";
import RequestContext from "../../contexts/RequestContext";
import { Filters } from "../filters/Filters";
import { Link } from "react-router-dom";

interface IProps {
  items?: Request[];
}
export const RequestTable = (props: IProps) => {
  const context = useContext(RequestContext);
  const items = props.items || context.filteredRequests;

  useEffect(() => {
    console.log(`Detected filter change`);
  }, [context.filters]);

  const resetFilters = () => {
    context.applyFilters(new Filters(), true);
  };

  return (
    <>
      {context.loading && (
        <div className="d-flex justify-content-center m-xl-5">
          <Spinner animation="border" role="status" variant="success">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      )}

      {!context.loading && (
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
              <RequestTableRow request={item} key={index}></RequestTableRow>
            ))}
          </tbody>
          <tfoot>
            {items && items.length == 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center" }}>
                  <Alert variant={"success"}>
                    There are no requests that match this filter.{" "}
                    <Link
                      to="/requests"
                      className="alert-link"
                      onClick={() => resetFilters()}
                    >
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
