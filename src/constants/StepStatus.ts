import { Request } from "../services/models/Request";
import { groupBy } from "../helpers/GroupBy";

/*
 * This stuff is all a big workaround to make the filtering interface
 * play nicely with the existing jQuery submission form in production.
 *
 * The app was built around the StepStatus array which is a constant that was
 * copied from the jQuery app mentioned above.  The steps are in order from 1 to 12
 * and the keys that really matter are:
 *
 * "uglyName" - which matches the value that the old app puts into the Request "status" field
 * "friendlyName" - which is what the react app uses as the display name for any particular step
 * "approvalName" is the key under which the legacy app stored approval information for a step
 * "approverRoles" which is the "role" name for the users that can take action at this step (ccUsers table)
 * "actionsAvailable" determines which actions a user can take for a request at this status
 *
 * NOTE: due to the way the legacy app worked, uglyName (stored in DB) is one step behind where
 * the request actually is.
 */

export interface IStatus {
  uglyName: string;
  friendlyName: string;
  approvalName: string;
  approverRoles: string[];
  actionsAvailable: string[];
}

export const StepStatus: IStatus[] = [
  {
    uglyName: "DRAFT",
    friendlyName: "Draft",
    approvalName: "",
    approverRoles: [],
    actionsAvailable: ["submit", "delete", "pdf", "clone"]
  },
  {
    uglyName: "SUBMITTED",
    friendlyName: "Director",
    approvalName: "directorateApproval",
    approverRoles: ["DIRECTORATE APPROVAL"],
    actionsAvailable: ["approve", "sendto", "reject", "pdf", "clone"]
  },
  {
    uglyName: "DIRECTORATE_APPROVAL",
    friendlyName: "Billing Official",
    approvalName: "billingOfficialApproval",
    approverRoles: ["BILLING OFFICIAL"],
    actionsAvailable: ["approve", "sendto", "reject", "pdf", "clone"]
  },
  {
    uglyName: "BILLING_OFFICIAL_APPROVAL",
    friendlyName: "Tech Review",
    approvalName: "j6Approval",
    approverRoles: ["IT APPROVAL/J6"],
    actionsAvailable: ["approve", "sendto", "reject", "pdf", "clone"]
  },
  {
    uglyName: "J6_APPROVAL",
    friendlyName: "PBO Approval",
    approvalName: "pboApproval",
    approverRoles: ["PROPERTY BOOKS OFFICER/J4"],
    actionsAvailable: ["approve", "sendto", "reject", "pdf", "clone"]
  },
  {
    uglyName: "PBO_APPROVAL",
    friendlyName: "Finance",
    approvalName: "j8Approval",
    approverRoles: ["FINANCIAL OFFICER/J8"],
    actionsAvailable: ["approve", "sendto", "reject", "pdf", "clone"]
  },
  {
    uglyName: "J8_APPROVAL",
    friendlyName: "Cardholder",
    approvalName: "cardholderValidation",
    approverRoles: ["CARD HOLDER"],
    actionsAvailable: ["approve", "sendto", "reject", "pdf", "clone"]
  },
  {
    uglyName: "CARD_HOLDER_VALIDATION",
    friendlyName: "Requestor",
    approvalName: "requestorValidation",
    approverRoles: [],
    actionsAvailable: ["approve", "sendto", "reject", "pdf", "clone"]
  },
  {
    uglyName: "REQUESTOR_VALIDATION",
    friendlyName: "Supply",
    approvalName: "supplyValidation",
    approverRoles: ["SUPPLY"],
    actionsAvailable: ["approve", "sendto", "reject", "pdf", "clone"]
  },
  {
    uglyName: "SUPPLY_VALIDATION",
    friendlyName: "PBO Final",
    approvalName: "finalValidation",
    approverRoles: ["PROPERTY BOOKS OFFICER/J4"],
    actionsAvailable: ["approve", "sendto", "reject", "pdf", "clone"]
  },
  {
    uglyName: "FINAL_VALIDATION",
    friendlyName: "BO Final",
    approvalName: "budgetOfficerApproval",
    approverRoles: ["BILLING OFFICIAL"],
    actionsAvailable: ["approve", "sendto", "reject", "pdf", "clone"]
  },
  {
    uglyName: "CLOSED",
    friendlyName: "Closed",
    approvalName: "",
    approverRoles: [],
    actionsAvailable: ["pdf", "clone"]
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

//statuses are stored in the db with the uglyName value
//leaving this here for when we write to db
export const convertToUgly = (friendlyName: string): string => {
  const status = StepStatus.find(
    status => status.friendlyName === friendlyName
  );
  return status ? status.uglyName : "";
};

export const convertToFriendly = (uglyName: string): string => {
  const status = StepStatus.find(status => status.uglyName === uglyName);
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

//this gets the next step that is required where no signature is currently present
//the requestApprovalReducer uses this to detemine what comes next
//handles skipped approvals by going backward if necessary
export const getNextStatus = (request: Request): any => {
  let nextRequest = new Request({ ...request });
  let next = nextRequest.status; //by default, keep it at the same step

  const statuses = Object.keys(getStatusesByFriendlyName());

  //loop through all possible statuses and check for signatures
  for (let index in statuses) {
    const status = statuses[index];
    const lastApproval = request.getLastActionFor(status, ["approve"]);

    //this request hasn't been approved at this step
    if (!lastApproval) {
      //current status doesn't count - we want the next one
      if (status == nextRequest.status) continue;

      //draft status doesn't require a signature
      if (status == "Draft" || status == "") continue;

      //stop at j6 only if it's required, otherwise keep looking
      if (status == "Tech Review") {
        if (nextRequest.requestField.RequestIsJ6 === "No") {
          continue;
        }
      }
      //found our next step
      next = status;
      break;
    }
  }
  return next;
};
