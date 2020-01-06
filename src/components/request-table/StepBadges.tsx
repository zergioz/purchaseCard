import React from "react";
import { Request } from "../../services/models/Request";
import {
  getStatusesByFriendlyName,
  getApprovalHistoryForStatus
} from "../../constants/StepStatus";
import { Badge, Popover, OverlayTrigger } from "react-bootstrap";

interface IProps {
  request: Request;
}
export const StepBadges = (props: IProps) => {
  const statuses = Object.keys(getStatusesByFriendlyName());
  const hiddenBadges = new Set(["Draft", "Submitted", "Closed"]);
  const badgeStyle = { margin: "2px", padding: "5px" };
  return (
    <>
      {statuses.map(status => {
        const approval = getApprovalHistoryForStatus(props.request, status);
        if (hiddenBadges.has(status)) return;

        const popover = (
          <Popover id={status} style={{ maxWidth: "1000px" }}>
            <Popover.Title as="h3">
              {approval ? "Signed" : "Not signed"}
            </Popover.Title>
            <Popover.Content>
              <pre>{JSON.stringify(approval, null, 2)}</pre>
            </Popover.Content>
          </Popover>
        );

        return (
          <div key={status} style={{ display: "inline", cursor: "pointer" }}>
            <OverlayTrigger trigger="hover" placement="top" overlay={popover}>
              <Badge
                variant={approval ? "success" : "secondary"}
                style={badgeStyle}
              >
                {status}
              </Badge>
            </OverlayTrigger>
          </div>
        );
      })}
    </>
  );
};
