import {
  IApprovalAction,
  ApprovalAction
} from "../services/models/ApprovalAction";
import {
  getStatusesByFriendlyName,
  IStatus,
  StatusesByFriendlyName
} from "../constants/StepStatus";
import { ApprovalActions } from "../constants/ApprovalActions";
import { IRequestApprovals } from "../services/models/Request";
const statuses: StatusesByFriendlyName = getStatusesByFriendlyName();

export const getApprovalForStatus = (
  status: string,
  approvals: IRequestApprovals
) => {
  const statusObj: IStatus = statuses[status];
  const approvalKey = statusObj.approvalName;
  const approval: any = approvals ? approvals[approvalKey] : undefined;
  return approval;
};

export const parseApproval = (approval: any): ApprovalAction => {
  let action: IApprovalAction = new ApprovalAction();

  if (approval) {
    if (
      approval.boStatus == "Declined" ||
      approval.directorateStatus == "Declined" ||
      approval.j6Status == "Declined" ||
      approval.pboStatus == "Declined"
    ) {
      action = new ApprovalAction(ApprovalActions["reject"]);
    } else {
      action = new ApprovalAction(ApprovalActions["approve"]);
    }
    action.date = new Date();
    action.formInputs["user"] = {};

    try {
      action.formInputs["comments"] =
        approval.directorateComment ||
        approval.boComment ||
        approval.j6Comment ||
        approval.pboComment ||
        approval.j8Comment ||
        approval.cardHolderComment ||
        approval.requestorComment ||
        approval.supplyComment ||
        approval.j4Comment;

      action.formInputs["userString"] =
        approval.directorateSignature ||
        approval.boSignature ||
        approval.j6Signature ||
        approval.pboSignature ||
        approval.j8Signature ||
        approval.cardHolderSignature ||
        approval.requestorSignature ||
        approval.supplySignature ||
        approval.j4Signature;

      //SIGNED BY: i:0#.w|sof\kale.sawyer ON: Thu Oct 10 2019 09:19:20 GMT+0200 (W. Europe Daylight Time)
      let decoded = decodeURIComponent(action.formInputs["userString"]);
      let result = decoded.split(" ON: ");
      let user = result[0].substring(11);
      action.formInputs["userString"] = user;
      let date = result[1];
      action.formInputs["dateString"] = date;
      action.date = new Date(date);
    } catch (e) {
      console.error(`parseApproval`, e);
    }
  }
  return action;
};

//try to get the legacy data into a usable format
export const convertApprovalsToHistory = (approvals: IRequestApprovals) => {
  let history: { [key: string]: IApprovalAction | undefined } = {};

  for (var key in statuses) {
    if (statuses.hasOwnProperty(key)) {
      if (new Set(["Draft", "Submitted", "Closed"]).has(key)) continue;
      const status = key;
      const approval = getApprovalForStatus(status, approvals);
      let action = approval ? parseApproval(approval) : undefined;
      history[status] = action;
    }
  }
  return history;
};
