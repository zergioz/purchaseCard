import React, { useContext } from "react";
import { RequestTableRow } from "./RequestTableRow";
import { Request } from "../../services/models/Request";
import { Table, Spinner } from "react-bootstrap";
import RequestContext from "../../contexts/RequestContext";
import { Filters } from "../filters/Filters";
import { NoResults } from "./NoResults";
import { LoadingResults } from "./LoadingResults";

interface IProps {
  items?: Request[];
}
export const RequestTable = (props: IProps) => {
  const context = useContext(RequestContext);
  const items = props.items || context.filteredRequests;

  const clearFilters = () => {
    context.applyFilters(new Filters(), true);
  };

  return (
    <>
      {context.loading && <LoadingResults />}
      {!context.loading && items && items.length > 0 && (
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
        </Table>
      )}
      {!context.loading && items && items.length == 0 && <NoResults />}
    </>
  );
};
