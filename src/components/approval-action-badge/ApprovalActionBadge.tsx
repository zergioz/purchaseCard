import React from "react";
import { OverlayTrigger, Badge, Popover, Card } from "react-bootstrap";
import { PopoverPlacement } from "./ApprovalActionBadgeBar";
import { ApprovalAction } from "../../services/models/ApprovalAction";
import { FiClock } from "react-icons/fi";
import { RequestTableDateCell } from "../request-table/RequestTableDateCell";

interface IProps {
  action: ApprovalAction | null;
  text: string;
  active: boolean;
  placement?: PopoverPlacement;
}
export const ApprovalActionBadge = (props: IProps) => {
  const badgeStyle = {
    margin: "2px",
    padding: "5px",
    cursor: "pointer",
    opacity: props.action || props.active ? 1 : 0.5
  };

  let badgeAction = props.action ? props.action.pastTense : "Not seen";
  badgeAction = props.active ? "Pending review" : badgeAction;

  let badgeColor = props.action ? props.action.bootstrapClass : "secondary";
  badgeColor = props.active ? "warning" : badgeColor;

  const popover = (
    <Popover id={props.text} style={{ maxWidth: "1000px" }}>
      <Popover.Title as="h3">{badgeAction}</Popover.Title>
      {props.action && (
        <Popover.Content>
          <Card style={{ width: "18rem" }}>
            <Card.Body>
              <Card.Subtitle className="mb-4">
                <span className="h5">
                  {props.action.formInputs["comments"] || (
                    <span className="text-secondary">No comments entered</span>
                  )}
                </span>
              </Card.Subtitle>
              <Card.Subtitle>
                <div>
                  <span>{badgeAction} by: </span>
                  <span className="font-weight-bold">
                    {props.action.formInputs["user"]
                      ? props.action.formInputs["user"].Title
                      : props.action.formInputs["userString"]}
                  </span>
                  <br />
                  <br />
                  <small className="float-right">
                    <RequestTableDateCell dateISOString={props.action.date} />
                  </small>
                </div>
              </Card.Subtitle>
            </Card.Body>
          </Card>
        </Popover.Content>
      )}
    </Popover>
  );

  return (
    <OverlayTrigger
      trigger="hover"
      placement={props.placement ? props.placement : "auto"}
      overlay={popover}
    >
      <Badge variant={badgeColor} style={badgeStyle}>
        {props.active && <FiClock />} {props.text}
      </Badge>
    </OverlayTrigger>
  );
};
