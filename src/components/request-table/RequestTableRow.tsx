import React from "react";
import { Request } from "../../services/models/Request";
import { ApprovalActionBadgeBar } from "../approval-action-badge/ApprovalActionBadgeBar";
import { ApprovalActionsButton } from "../approval-actions-button/ApprovalActionsButton";
import { Button, ButtonToolbar } from "react-bootstrap";
import { RequestTableDateCell } from "./RequestTableDateCell";
import "./RequestTable.css";
interface IProps {
  request: Request;
  onRequestUpdated: (oldRequest: Request, newRequest: Request) => void;
}
export const RequestTableRow: React.FC<IProps> = props => {
  const item: Request = props.request;
  const onRequestUpdated = (oldRequest: Request, newRequest: Request) => {
    props.onRequestUpdated(oldRequest, newRequest);
  };
  return (
    <tr>
      <td className="action-button-col">
        {/* <ButtonToolbar>
          <Button
            className="w-100"
            variant="primary"
            size="sm"
            href={`#/requests/details/${item.id}`}
          >
            <span className="nowrap">View #{item.id}</span>
          </Button>
          <ApprovalActionsButton
            className="w-100"
            variant="outline-danger"
            request={item}
            onRequestUpdated={onRequestUpdated}
          />
        </ButtonToolbar> */}
        <ButtonToolbar>
          <Button
            className="w-100"
            variant="primary"
            size="sm"
            href={`Pages/purchase_request.aspx?id=${item.id}`}
          >
            <span className="nowrap" style={{ whiteSpace: "pre" }}>
              View #{item.id}
            </span>
          </Button>
        </ButtonToolbar>
      </td>
      <td className="text-center">{item.requestField!.RequestorDirectorate}</td>
      <td>
        <small className="text-secondary">Requestor</small>
        <br />
        {`${item.requestor!.FirstName} ${item.requestor!.LastName}`}
        <br />
        <small className="text-secondary">Cardholder</small>
        <br />
        {item.requestField.RequestorCardHolderName
          ? item.requestField.RequestorCardHolderName.split("@")[0]
          : ""}
      </td>
      <td>
        {item.requestField.fiscalYear || ""}
        <br />
        {item.requestField.fiscalQuarter || ""}
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
        <RequestTableDateCell dateISOString={item.created} />
      </td>
    </tr>
  );
};
