import React from "react";
import { ApprovalAction } from "../services/models/ApprovalAction";
import { Request } from "../services/models/Request";
import { getNextStatus } from "../constants/StepStatus";

export const ApprovalReducer = (
  request: Request,
  action: ApprovalAction
): Request => {
  let nextRequest = request;
  console.log(`reducer`, action);
  switch (action.type) {
    case "sendto":
      nextRequest.status = action.formInputs["status"];
      console.log("sendto", nextRequest.status);
      break;
    case "approve":
      nextRequest.status = getNextStatus(request);
      console.log("approve", nextRequest.status);
      break;
    case "reject":
      nextRequest.status = "Closed";
      console.log("reject", nextRequest.status);
      break;
    default:
      console.log(`requestApprovalReducer: No action.`);
  }
  console.log(`nextRequest`, nextRequest);
  if (nextRequest.history) nextRequest.history.push(action);
  return nextRequest;
};
