import { Request, IRequestApprovals } from "../services/models/Request";
import { groupBy } from "../helpers/GroupBy";

/*
 * This stuff is all a big workaround to make the filtering interface
 * play nicely with the existing jQuery submission form in production.
 *
 * The app was built around the StepStatus array which is a constant that was
 * copied from production.  The steps are in order from 1 to 12
 * and the only keys that really matter are "caseStep" - which matches the
 * value that the old app puts into the Request "status" field - and
 * "friendlyName" - which is what the react app uses as the display name
 * for any particular step.
 */

export interface IStatus {
  stepName: string;
  stepStatus: string;
  stepArray: string[];
  caseStep: string;
  fwd: string;
  fwdj6: string;
  numerStep: number;
  friendlyName: string;
  approvalName: string;
}

export const StepStatus: IStatus[] = [
  {
    stepName: "",
    stepStatus: "",
    stepArray: [],
    caseStep: "DRAFT",
    fwd: "DRAFT",
    fwdj6: "DRAFT",
    numerStep: 1,
    friendlyName: "Draft",
    approvalName: ""
  },
  {
    stepName: "",
    stepStatus: "",
    stepArray: [],
    caseStep: "SUBMITTED",
    fwd: "DIR APPROVAL",
    fwdj6: "DIR APPROVAL",
    numerStep: 2,
    friendlyName: "Director",
    approvalName: ""
  },
  {
    stepName: "directorate",
    stepStatus: "DIRECTORATE_APPROVAL",
    stepArray: [
      "directorateComment",
      "directorateStatus",
      "directorateSignature"
    ],
    caseStep: "DIRECTORATE_APPROVAL",
    fwd: "BO APPROVAL",
    fwdj6: "BO APPROVAL",
    numerStep: 3,
    friendlyName: "Billing Official",
    approvalName: "directorateApproval"
  },
  {
    stepName: "bo",
    stepStatus: "BILLING_OFFICIAL_APPROVAL",
    stepArray: ["boComment", "boStatus", "boSignature"],
    caseStep: "BILLING_OFFICIAL_APPROVAL",
    fwd: "PBO APPROVAL",
    fwdj6: "J6 APPROVAL",
    numerStep: 4,
    friendlyName: "Tech Review",
    approvalName: "billingOfficialApproval"
  },
  {
    stepName: "j6",
    stepStatus: "J6_APPROVAL",
    stepArray: ["j6Comment", "j6Status", "j6Signature"],
    caseStep: "J6_APPROVAL",
    fwd: "ERROR: SEE J69",
    fwdj6: "PBO APPROVAL",
    numerStep: 5,
    friendlyName: "PBO Approval",
    approvalName: "j6Approval"
  },
  {
    stepName: "pbo",
    stepStatus: "PBO_APPROVAL",
    stepArray: ["pboComment", "pboStatus", "pboSignature"],
    caseStep: "PBO_APPROVAL",
    fwd: "J8 APPROVAL",
    fwdj6: "J8 APPROVAL",
    numerStep: 6,
    friendlyName: "Finance",
    approvalName: "pboApproval"
  },
  {
    stepName: "j8",
    stepStatus: "J8_APPROVAL",
    stepArray: ["j8Comment", "j8FiscalYear", "j8Quater", "j8Signature"],
    caseStep: "J8_APPROVAL",
    fwd: "CARD HOLDER VALIDATION",
    fwdj6: "CARD HOLDER VALIDATION",
    numerStep: 7,
    friendlyName: "Cardholder",
    approvalName: "j8Approval"
  },
  {
    stepName: "cardholder",
    stepStatus: "CARD_HOLDER_VALIDATION",
    stepArray: [
      "cardHolderComment",
      "cardHolderTransactionId",
      "cardHolderExecuted",
      "cardHolderSignature"
    ],
    caseStep: "CARD_HOLDER_VALIDATION",
    fwd: "REQUESTOR VALIDATION",
    fwdj6: "REQUESTOR VALIDATION",
    numerStep: 8,
    friendlyName: "Requestor",
    approvalName: "cardholderValidation"
  },
  {
    stepName: "requestor",
    stepStatus: "REQUESTOR_VALIDATION",
    stepArray: ["requestorComment", "requestorSignature"],
    caseStep: "REQUESTOR_VALIDATION",
    fwd: "SUPPLY VALIDATION",
    fwdj6: "SUPPLY VALIDATION",
    numerStep: 9.3,
    friendlyName: "Supply",
    approvalName: "requestorValidation"
  },
  {
    stepName: "supply",
    stepStatus: "SUPPLY_VALIDATION",
    stepArray: ["supplyComment", "supplySignature"],
    caseStep: "SUPPLY_VALIDATION",
    fwd: "PENDING PBO FINAL",
    fwdj6: "PENDING PBO FINAL",
    numerStep: 9.6,
    friendlyName: "PBO Final",
    approvalName: "supplyValidation"
  },
  {
    stepName: "j4",
    stepStatus: "FINAL_VALIDATION",
    stepArray: ["j4Comment", "j4Signature"],
    caseStep: "FINAL_VALIDATION",
    fwd: "PENDING CLOSING",
    fwdj6: "PENDING CLOSING",
    numerStep: 9.9,
    friendlyName: "BO Final",
    approvalName: "finalValidation"
  },
  {
    stepName: "",
    stepStatus: "",
    stepArray: [],
    caseStep: "CLOSED",
    fwd: "CLOSED",
    fwdj6: "CLOSED",
    numerStep: 10,
    friendlyName: "Closed",
    approvalName: ""
  }
];

export type StatusesByFriendlyName = {
  [key: string]: IStatus;
};

//for looking up actual status values by friendly name because
//they are stored in the db in all caps
export const getStatusesByFriendlyName = (): StatusesByFriendlyName => {
  let statuses: StatusesByFriendlyName = {};
  StepStatus.map((status: IStatus) => {
    const key: string = status.friendlyName;
    statuses[key] = status;
  });
  return statuses;
};

//statuses are stored in the db with the caseStep value
//leaving this here for when we write to db
export const convertToUgly = (friendlyName: string): string => {
  const status = StepStatus.find(
    status => status.friendlyName === friendlyName
  );
  return status ? status.caseStep : "";
};

export const convertToFriendly = (caseStep: string): string => {
  const status = StepStatus.find(status => status.caseStep === caseStep);
  return status ? status.friendlyName : "";
};

//groups requests by status and counts them to make the badges
export const groupByStatus = (requests: Request[]): number[] => {
  let counts: number[] = [];
  const statuses = Object.keys(getStatusesByFriendlyName());
  if (requests) {
    //group requests by their statuses
    const groups = groupBy(requests, (request: Request) => request.status);

    statuses.map((statusValue: any, index: number) => {
      const requestsInStatus = groups.get(statusValue);
      const count = requestsInStatus ? requestsInStatus.length : 0;
      counts[index] = count;
    });
  }
  return counts;
};

//this takes a request and gets the approval info that was recorded at a specific status
export const getApprovalHistoryForStatus = (
  request: Request,
  status: string
): any => {
  const statuses: StatusesByFriendlyName = getStatusesByFriendlyName();
  const statusObj: IStatus = statuses[status];
  const approvalKey = statusObj.approvalName;
  const approvals: IRequestApprovals = request.approvals;
  const approval: any = approvals ? approvals[approvalKey] : undefined;
  return approval;
};

//this gets the next step that is required but no signature is present
//may handle skipped approvals by going backward (due to bad data in db)
export const getNextApprovalRequired = (
  request: Request,
  status: string
): any => {};
