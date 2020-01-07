import React from "react";
import { Request } from "../../services/models/Request";
import { ApprovalBadges } from "../approval-badge/ApprovalBadges";
import { Link } from "react-router-dom";
interface IProps {
  request: Request;
}
export const RequestTableRow: React.FC<IProps> = props => {
  const item: Request = props.request;

  return (
    <tr>
      <td>
        {/* <a href={`Pages/purchase_request.aspx?id=${item.id}`}>{item.id}</a> */}
        <Link to={`/requests/details/${item.id}`}>{item.id}</Link>
      </td>

      <td>{item.requestField!.RequestorDirectorate}</td>
      <td>
        <a href={`mailto:${item.requestor!.EMail}`}>{`${
          item.requestor!.FirstName
        } ${item.requestor!.LastName}`}</a>
      </td>
      <td>{item.requestField!.RequestorCardHolderName}</td>
      <td>
        {item.approvals["j8Approval"]!
          ? item.approvals["j8Approval"]!.j8FiscalYear
          : ""}
      </td>
      <td>
        {item.approvals["j8Approval"]!
          ? item.approvals["j8Approval"]!.j8Quater
          : ""}
      </td>
      <td>
        <div>
          <ApprovalBadges request={props.request} popoverPlacement="top" />
        </div>
        <div>{item.requestField!.RequestJustification}</div>
      </td>
      <td>{item.requestField!.RequestDateofRequest}</td>
      <td>{item.status}</td>
    </tr>
  );
};
