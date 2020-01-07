import React, { ReactElement } from "react";
import { SendToForm } from "../components/approval-forms/SendToForm";
import { SimpleApprovalForm } from "../components/approval-forms/SimpleApprovalForm";

export interface ApprovalAction {
  bootstrapClass:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "dark"
    | "light"
    | undefined;
  type: string;
  actor: string;
  action: string;
  actionPast: string;
  description: string;
  form: any;
}

export interface ApprovalActions {
  [key: string]: ApprovalAction;
}

export const ApprovalActions: ApprovalActions = {
  sendto: {
    bootstrapClass: "info",
    type: "sendto",
    actor: "Sender",
    action: "Send to",
    actionPast: "Sent to",
    description:
      "You are sending this request to another step without signing it.",
    form: SendToForm
  },
  approve: {
    bootstrapClass: "success",
    type: "approve",
    actor: "Approver",
    action: "Approve",
    actionPast: "Approved",
    description:
      "You are approving this request and sending it to the next step.",
    form: SimpleApprovalForm
  },
  reject: {
    bootstrapClass: "danger",
    type: "reject",
    actor: "Rejector",
    action: "Reject",
    actionPast: "Rejected",
    description: "You are rejecting this request and marking it as closed.",
    form: SimpleApprovalForm
  }
};
