import React, { useState, useEffect } from "react";
import { Request } from "../../services/models/Request";
import {
  getStatusesByFriendlyName,
  getApprovalHistoryForStatus
} from "../../constants/StepStatus";
import { ApprovalBadge } from "./ApprovalBadge";

export type PopoverPlacement =
  | "auto-start"
  | "auto"
  | "auto-end"
  | "top-start"
  | "top"
  | "top-end"
  | "right-start"
  | "right"
  | "right-end"
  | "bottom-end"
  | "bottom"
  | "bottom-start"
  | "left-end"
  | "left"
  | "left-start";

export const useApprovalBadges = (
  request: Request,
  popoverPlacement: PopoverPlacement,
  statusText: boolean = true
) => {
  const hiddenBadges = new Set(["Draft", "Submitted", "Closed"]);
  const statuses = Object.keys(getStatusesByFriendlyName());
  const [badges, setBadges] = useState<Array<any>>([]);

  useEffect(() => {
    const recalcBadges = createBadges();
    setBadges(recalcBadges);
  }, [request.status]);

  const createBadges = () => {
    return statuses.map(status => {
      if (hiddenBadges.has(status)) return;
      const approval = request.getLastActionFor(status);
      const signedOrUnsigned = approval ? "Signed" : "Unsigned";
      return (
        <ApprovalBadge
          key={status}
          approval={approval}
          text={statusText ? status : signedOrUnsigned}
          placement={popoverPlacement}
        />
      );
    });
  };

  return badges;
};

interface IProps {
  request: Request;
  popoverPlacement: PopoverPlacement;
}
export const ApprovalBadges = (props: IProps) => {
  const badges = useApprovalBadges(props.request, props.popoverPlacement);
  return <div style={{ display: "inline" }}>{badges}</div>;
};
