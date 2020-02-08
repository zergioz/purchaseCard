import React, { useState, useEffect } from "react";
import { Request } from "../../services/models/Request";
import { getStatusesByFriendlyName } from "../../constants/StepStatus";
import { ApprovalActionBadge } from "./ApprovalActionBadge";

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

export const useActionBadges = (
  request: Request,
  popoverPlacement: PopoverPlacement,
  statusText: boolean = true,
  hide?: string[]
) => {
  const hiddenBadges = new Set(hide || ["Draft", "Submitted", "Closed"]);
  const statuses = Object.keys(getStatusesByFriendlyName());
  const [badges, setBadges] = useState<Array<any>>([]);

  useEffect(() => {
    const recalcBadges = createBadges();
    setBadges(recalcBadges);
  }, [request.status]);

  const createBadges = () => {
    return statuses.map(status => {
      if (hiddenBadges.has(status)) return;
      const active = status == request.status;
      const action = request.getLastActionFor(status, [
        "approve",
        "sendto",
        "reject"
      ]);
      const signedOrUnsigned = action ? action.pastTense : "Unsigned";
      return (
        <ApprovalActionBadge
          key={status}
          action={action}
          text={statusText ? status : signedOrUnsigned}
          active={active}
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
export const ApprovalActionBadgeBar = (props: IProps) => {
  const badges = useActionBadges(props.request, props.popoverPlacement);
  return <div style={{ display: "inline" }}>{badges}</div>;
};
