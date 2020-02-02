import { RequestApprovalForm } from "../components/approval-forms/RequestApprovalForm";
import { ApprovalAction } from "../services/models/ApprovalAction";

export interface IApprovalActions {
  [key: string]: ApprovalAction;
}

export const ApprovalActions: IApprovalActions = {
  noop: {
    bootstrapClass: "warning",
    type: "noop",
    actor: "NOOP",
    action: "NOOP",
    date: new Date().toISOString(),
    verb: "NOOP",
    pastTense: "NOOP",
    description: "NOOP",
    form: "div",
    formInputs: {},
    formInputsRequired: []
  },
  sendto: {
    bootstrapClass: "primary",
    type: "sendto",
    actor: "Sent by",
    action: "Send to",
    date: new Date().toISOString(),
    verb: "Send",
    pastTense: "Rerouted",
    description:
      "You are sending this request to another step without signing it.",
    form: RequestApprovalForm,
    formInputs: {
      status: "Draft",
      comments: "",
      user: ""
    },
    formInputsRequired: ["status", "comments", "user"]
  },
  approve: {
    bootstrapClass: "success",
    type: "approve",
    actor: "Approved by",
    action: "Approve",
    date: new Date().toISOString(),
    verb: "Approve",
    pastTense: "Approved",
    description:
      "You are approving this request and sending it to the next step.",
    form: RequestApprovalForm,
    formInputs: {
      status: "",
      comments: "",
      user: ""
    },
    formInputsRequired: ["comments", "user"]
  },
  reject: {
    bootstrapClass: "danger",
    type: "reject",
    actor: "Rejected by",
    action: "Reject",
    date: new Date().toISOString(),
    verb: "Reject",
    pastTense: "Rejected",
    description: "You are rejecting this request and marking it as closed.",
    form: RequestApprovalForm,
    formInputs: {
      status: "",
      comments: "",
      user: ""
    },
    formInputsRequired: ["comments", "user"]
  }
};