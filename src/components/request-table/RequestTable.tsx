import React from "react";
import { RequestTableRow } from "./RequestTableRow";
import { Request } from "../../services/models/Request";
import { Table } from "react-bootstrap";

export const RequestTable = (props: any) => {
  return (
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
        {props.items.map((item: Request, index: number) => (
          <RequestTableRow request={item} key={index}></RequestTableRow>
        ))}
      </tbody>
      <tfoot>
        {props.items && props.items.length == 0 && (
          <tr>
            <td colSpan={7} style={{ textAlign: "center" }}>
              <span className="light">Nothing to show.</span>
            </td>
          </tr>
        )}
      </tfoot>
    </Table>
  );
};
