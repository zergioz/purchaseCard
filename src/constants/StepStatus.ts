import { Request } from "../services/models/Request";
import { groupBy } from "../helpers/GroupBy";

export interface IStatus {
  caseStep: string;
  fwd: string;
  fwdj6: string;
  numerStep: number;
  friendlyName: string;
}

export const StepStatus: IStatus[] = [
  {
    caseStep: "DRAFT",
    fwd: "DRAFT",
    fwdj6: "DRAFT",
    numerStep: 1,
    friendlyName: "Draft"
  },
  {
    caseStep: "SUBMITTED",
    fwd: "DIR APPROVAL",
    fwdj6: "DIR APPROVAL",
    numerStep: 2,
    friendlyName: "Submitted"
  },
  {
    caseStep: "DIRECTORATE_APPROVAL",
    fwd: "BO APPROVAL",
    fwdj6: "BO APPROVAL",
    numerStep: 3,
    friendlyName: "Director"
  },
  {
    caseStep: "BILLING_OFFICIAL_APPROVAL",
    fwd: "PBO APPROVAL",
    fwdj6: "J6 APPROVAL",
    numerStep: 4,
    friendlyName: "Billing Official"
  },
  {
    caseStep: "J6_APPROVAL",
    fwd: "ERROR: SEE J69",
    fwdj6: "PBO APPROVAL",
    numerStep: 5,
    friendlyName: "Tech Review"
  },
  {
    caseStep: "PBO_APPROVAL",
    fwd: "J8 APPROVAL",
    fwdj6: "J8 APPROVAL",
    numerStep: 6,
    friendlyName: "PBO Approval"
  },
  {
    caseStep: "J8_APPROVAL",
    fwd: "CARD HOLDER VALIDATION",
    fwdj6: "CARD HOLDER VALIDATION",
    numerStep: 7,
    friendlyName: "Finance"
  },
  {
    caseStep: "CARD_HOLDER_VALIDATION",
    fwd: "REQUESTOR VALIDATION",
    fwdj6: "REQUESTOR VALIDATION",
    numerStep: 8,
    friendlyName: "Cardholder"
  },
  {
    caseStep: "REQUESTOR_VALIDATION",
    fwd: "SUPPLY VALIDATION",
    fwdj6: "SUPPLY VALIDATION",
    numerStep: 9.3,
    friendlyName: "Requestor"
  },
  {
    caseStep: "SUPPLY_VALIDATION",
    fwd: "PENDING PBO FINAL",
    fwdj6: "PENDING PBO FINAL",
    numerStep: 9.6,
    friendlyName: "Supply"
  },
  {
    caseStep: "FINAL_VALIDATION",
    fwd: "PENDING CLOSING",
    fwdj6: "PENDING CLOSING",
    numerStep: 9.9,
    friendlyName: "Final"
  },
  {
    caseStep: "CLOSED",
    fwd: "CLOSED",
    fwdj6: "CLOSED",
    numerStep: 10,
    friendlyName: "Closed"
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
