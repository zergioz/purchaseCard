import React from "react";
import { Request } from "../../services/models/Request";
import { ApprovalActionBadgeBar } from "../approval-action-badge/ApprovalActionBadgeBar";
import { Link } from "react-router-dom";
import { ApprovalActionsButton } from "../approval-actions-button/ApprovalActionsButton";
interface IProps {
  request: Request;
}
export const RequestTableRow: React.FC<IProps> = props => {
  const item: Request = props.request;
  const onRequestUpdated = (oldRequest: Request, newRequest: Request) => {
    console.log("Request updated", newRequest);
  };
  return (
    <tr>
      <td>
        {/* <a href={`Pages/purchase_request.aspx?id=${item.id}`}>{item.id}</a> */}
        <Link to={`/requests/details/${item.id}`}>{item.id}</Link>
      </td>

      <td>{item.requestField!.RequestorDirectorate}</td>
      <td>{`${item.requestor!.FirstName} ${item.requestor!.LastName}`}</td>
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
          <ApprovalActionBadgeBar
            request={props.request}
            popoverPlacement="top"
          />
        </div>
        <div>{item.requestField!.RequestJustification}</div>
      </td>
      <td>{item.requestField!.RequestDateofRequest}</td>
      <td>{item.status}</td>
      <td>
        <ApprovalActionsButton
          request={item}
          onRequestUpdated={onRequestUpdated}
        />
      </td>
    </tr>
  );
};
