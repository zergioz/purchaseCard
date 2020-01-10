import React from "react";
import { OverlayTrigger, Badge, Popover, Card } from "react-bootstrap";
import { PopoverPlacement } from "./ApprovalActionBadgeBar";
import { ApprovalAction } from "../../services/models/ApprovalAction";
import { FiClock } from "react-icons/fi";

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
  const badgeAction = props.action ? props.action.pastTense : "Not Signed";
  let badgeColor = props.action ? props.action.bootstrapClass : "secondary";
  badgeColor = props.active ? "warning" : badgeColor;

  const popover = (
    <Popover id={props.text} style={{ maxWidth: "1000px" }}>
      <Popover.Title as="h3">{badgeAction}</Popover.Title>
      {props.action && (
        <Popover.Content>
          <Card style={{ width: "18rem" }}>
            <Card.Body>
              <Card.Subtitle>
                {props.action.formInputs["comments"] || "No comments entered."}
                <br />
                <br />
              </Card.Subtitle>
              <Card.Subtitle>
                <span>{badgeAction} by: </span>
                <span className="font-weight-bold">
                  {props.action.formInputs["user"]
                    ? props.action.formInputs["user"].Title
                    : props.action.formInputs["userString"]}
                </span>
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
