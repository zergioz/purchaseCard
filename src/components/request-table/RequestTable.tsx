import React from "react";
import { RequestTableRow } from "./RequestTableRow";
import { Request } from "../../services/models/Request";

export const RequestTable = (props: any) => {
  return (
    <div className="card-body">
      <div className="table-responsive">
        <table className="table table-hover tablesorter" id="myTable">
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
        </table>
      </div>
    </div>
  );
};
