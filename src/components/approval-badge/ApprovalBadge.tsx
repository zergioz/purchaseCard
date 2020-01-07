import React from "react";
import { OverlayTrigger, Badge, Popover } from "react-bootstrap";
import { PopoverPlacement } from "./ApprovalBadges";

interface IProps {
  approval: any;
  text: string;
  placement?: PopoverPlacement;
}
export const ApprovalBadge = (props: IProps) => {
  const badgeStyle = { margin: "2px", padding: "5px", cursor: "pointer" };

  const popover = (
    <Popover id={props.text} style={{ maxWidth: "1000px" }}>
      <Popover.Title as="h3">
        {props.approval ? "Signed" : "Not signed"}
      </Popover.Title>
      <Popover.Content hidden={!props.approval}>
        <pre>{JSON.stringify(props.approval, null, 2)}</pre>
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
        variant={props.approval ? "success" : "secondary"}
        style={badgeStyle}
      >
        {props.text}
      </Badge>
    </OverlayTrigger>
  );
};
