import React from "react";
import { Request } from "../../services/models/Request";
import {
  getStatusesByFriendlyName,
  getApprovalHistoryForStatus
} from "../../constants/StepStatus";
import { ApprovalBadge } from "./ApprovalBadge";

export const useApprovalBadges = (request: Request) => {
  const hiddenBadges = new Set(["Draft", "Submitted", "Closed"]);
  const statuses = Object.keys(getStatusesByFriendlyName());

  const badges = statuses.map(status => {
    const approval = getApprovalHistoryForStatus(request, status);
    if (hiddenBadges.has(status)) return;
    return <ApprovalBadge key={status} approval={approval} status={status} />;
  });

  return badges;
};

interface IProps {
  request: Request;
}
export const ApprovalBadges = (props: IProps) => {
  const badges = useApprovalBadges(props.request);
  return <div style={{ display: "inline" }}>{badges}</div>;
};
