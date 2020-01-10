import React from "react";
import { OverlayTrigger, Badge, Popover } from "react-bootstrap";
import { PopoverPlacement } from "./ApprovalBadges";
import { ApprovalAction } from "../../services/models/ApprovalAction";

interface IProps {
  action: ApprovalAction | null;
  text: string;
  placement?: PopoverPlacement;
}
export const ApprovalActionBadge = (props: IProps) => {
  const badgeStyle = { margin: "2px", padding: "5px", cursor: "pointer" };

  const popover = (
    <Popover id={props.text} style={{ maxWidth: "1000px" }}>
      <Popover.Title as="h3">
        {props.action ? "Signed" : "Not signed"}
      </Popover.Title>
      <Popover.Content hidden={!props.action}>
        <pre>{JSON.stringify(props.action, null, 2)}</pre>
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
        variant={props.action ? "success" : "secondary"}
        style={badgeStyle}
      >
        {props.text}
      </Badge>
    </OverlayTrigger>
  );
};
