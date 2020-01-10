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

//gets the friendly status string for a legacy approval key based on the
//information in the status constants
export const getStatusForApprovalName = (approvalName: string): string => {
  let foundKey = "";
  Object.entries(statuses).find(([key, value]) => {
    foundKey = key;
    return value.approvalName == approvalName;
  });
  return foundKey;
};

//takes finds the legacy approval object that was created for a specific status
export const getApprovalForStatus = (
  status: string,
  approvals: IRequestApprovals
): any => {
  const statusObj: IStatus = statuses[status];
  const approvalKey = statusObj.approvalName;
  const approval: any = approvals ? approvals[approvalKey] : undefined;
  return approval;
};

//yeah.
export const parseApproval = (approval: any): ApprovalAction => {
  let type: string, formInputs: any, date: Date;
  type = "noop";
  formInputs = {};
  date = new Date();

  if (approval) {
    if (
      approval.boStatus == "Declined" ||
      approval.directorateStatus == "Declined" ||
      approval.j6Status == "Declined" ||
      approval.pboStatus == "Declined"
    ) {
      type = "reject";
    } else {
      type = "approve";
    }

    try {
      formInputs["comments"] =
        approval.directorateComment ||
        approval.boComment ||
        approval.j6Comment ||
        approval.pboComment ||
        approval.j8Comment ||
        approval.cardHolderComment ||
        approval.requestorComment ||
        approval.supplyComment ||
        approval.j4Comment;

      formInputs["userString"] =
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
      let decoded = decodeURIComponent(formInputs["userString"]);
      let result = decoded.split(" ON: ");
      let userStr = result[0].substring(11);
      formInputs["userString"] = userStr;
      let dateStr = result[1];
      formInputs["dateString"] = date;
      date = new Date(dateStr);
    } catch (e) {
      console.error(`parseApproval`, e);
    }
  }
  return { ...ApprovalActions[type], date: date, formInputs: formInputs };
};

//try to get the legacy data into a usable format. match each legacy approval to its friendly status,
//parse the date/signature, and stuff that info into a RequestApproval
export const convertApprovalsToHistory = (approvals: IRequestApprovals) => {
  let history: { [key: string]: IApprovalAction | undefined } = {};
  for (var key in approvals) {
    if (approvals.hasOwnProperty(key)) {
      const status = getStatusForApprovalName(key);
      const approval = getApprovalForStatus(status, approvals);
      let action: any = approval ? parseApproval(approval) : undefined;
      history[status] = action;
    }
  }

  return history;
};
