import React from "react";
import { OverlayTrigger, Badge, Popover } from "react-bootstrap";

interface IProps {
  approval: any;
  text: string;
}
export const ApprovalBadge = (props: IProps) => {
  const badgeStyle = { margin: "2px", padding: "5px", cursor: "pointer" };

  const popover = (
    <Popover id={props.text} style={{ maxWidth: "1000px" }}>
      <Popover.Title as="h3">
        {props.approval ? "Signed" : "Not signed"}
      </Popover.Title>
      <Popover.Content>
        <pre>{JSON.stringify(props.approval, null, 2)}</pre>
      </Popover.Content>
    </Popover>
  );

  return (
    <OverlayTrigger trigger="hover" placement="top" overlay={popover}>
      <Badge
        variant={props.approval ? "success" : "secondary"}
        style={badgeStyle}
      >
        {props.text}
      </Badge>
    </OverlayTrigger>
  );
};
