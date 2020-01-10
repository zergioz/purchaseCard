import React from "react";
import { OverlayTrigger, Badge, Popover } from "react-bootstrap";
import { PopoverPlacement } from "./ApprovalActionBadgeBar";
import { ApprovalAction } from "../../services/models/ApprovalAction";

interface IProps {
  action: ApprovalAction | null;
  text: string;
  placement?: PopoverPlacement;
}
export const ApprovalActionBadge = (props: IProps) => {
  const badgeStyle = { margin: "2px", padding: "5px", cursor: "pointer" };
  const badgeTitle = props.action ? props.action.pastTense : "Not Signed";

  const popover = (
    <Popover id={props.text} style={{ maxWidth: "1000px" }}>
      <Popover.Title as="h3">{badgeTitle}</Popover.Title>
      <Popover.Content>
        {props.action && (
          <div>
            {/* Actioned by:{" "}
            {props.action!.formInputs["user"]!.Title ||
              props.action!.formInputs["userString"]} */}
          </div>
        )}
      </Popover.Content>
    </Popover>
  );

  return (
    <OverlayTrigger
      trigger="hover"
      placement={props.placement ? props.placement : "auto"}
      overlay={popover}
    >
      <Badge
        variant={props.action ? props.action.bootstrapClass : "secondary"}
        style={badgeStyle}
      >
        {props.text}
      </Badge>
    </OverlayTrigger>
  );
};
