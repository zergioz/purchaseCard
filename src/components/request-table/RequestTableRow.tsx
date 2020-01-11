import React from "react";
import { Request } from "../../services/models/Request";
import { ApprovalActionBadgeBar } from "../approval-action-badge/ApprovalActionBadgeBar";
import { ApprovalActionsButton } from "../approval-actions-button/ApprovalActionsButton";
import { Button, ButtonToolbar } from "react-bootstrap";
import { RequestTableDateCell } from "./RequestTableDateCell";
import "./RequestTable.css";
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
      <td className="action-button-col">
        <ButtonToolbar>
          <Button
            className="w-100"
            variant="primary"
            size="sm"
            href={`#/requests/details/${item.id}`}
          >
            View #{item.id}
          </Button>
          <ApprovalActionsButton
            className="w-100"
            variant="outline-danger"
            request={item}
            onRequestUpdated={onRequestUpdated}
          />
        </ButtonToolbar>

        {/* <a href={`Pages/purchase_request.aspx?id=${item.id}`}>{item.id}</a> */}
        {/* <Link to={`/requests/details/${item.id}`}>Open #{item.id}</Link> */}
      </td>
      <td>{item.requestField!.RequestorDirectorate}</td>
      <td>{`${item.requestor!.FirstName} ${item.requestor!.LastName}`}</td>
      <td>{item.requestField!.RequestorCardHolderName!.split("@")[0]}</td>
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
      <td>
        <RequestTableDateCell date={item.created} />
      </td>
    </tr>
  );
};
