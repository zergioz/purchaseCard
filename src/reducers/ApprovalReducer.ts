import React from "react";
import { ApprovalAction } from "../services/models/ApprovalAction";
import { Request } from "../services/models/Request";
import { getNextStatus } from "../constants/StepStatus";

export const ApprovalReducer = (
  request: Request,
  action: ApprovalAction
): Request => {
  let nextRequest = request;
  let nextStatus = request.status;
  let nextHistory = request.history[request.status];
  if (request.status) {
    switch (action.type) {
      case "sendto":
        nextStatus = action.formInputs["status"];
        break;
      case "approve":
        nextStatus = getNextStatus(request);
        break;
      case "reject":
        nextStatus = "Closed";
        break;
      default:
        console.log(`requestApprovalReducer: No action.`);
    }
  }
  nextHistory.push(action);
  nextRequest.status = nextStatus;
  return nextRequest;
};
