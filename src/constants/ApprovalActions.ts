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
  verb: string;
  actionPast: string;
  description: string;
  form: any;
  formInputs: any;
}

export interface ApprovalActions {
  [key: string]: ApprovalAction;
}

export const ApprovalActions: ApprovalActions = {
  noop: {
    bootstrapClass: "info",
    type: "noop",
    actor: "Noone",
    action: "Nothing",
    verb: "Do nothing",
    actionPast: "Did nothing",
    description: "You are doing nothing",
    form: "div",
    formInputs: {}
  },
  sendto: {
    bootstrapClass: "info",
    type: "sendto",
    actor: "Sender",
    action: "Send to",
    verb: "Send",
    actionPast: "Sent to",
    description:
      "You are sending this request to another step without signing it.",
    form: SendToForm,
    formInputs: {}
  },
  approve: {
    bootstrapClass: "success",
    type: "approve",
    actor: "Approver",
    action: "Approve",
    verb: "Approve",
    actionPast: "Approved",
    description:
      "You are approving this request and sending it to the next step.",
    form: SimpleApprovalForm,
    formInputs: {}
  },
  reject: {
    bootstrapClass: "danger",
    type: "reject",
    actor: "Rejector",
    action: "Reject",
    verb: "Reject",
    actionPast: "Rejected",
    description: "You are rejecting this request and marking it as closed.",
    form: SimpleApprovalForm,
    formInputs: {}
  }
};
