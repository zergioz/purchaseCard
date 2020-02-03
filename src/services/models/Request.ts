import { autoserializeAs, autoserialize } from "cerialize";
import { RequestField } from "./RequestField";
import { PurchaseDetails } from "./PurchaseDetails";
import { BudgetOfficerApproval } from "./BudgetOfficerApproval";
import { BillingOfficialApproval } from "./BillingOfficialApproval";
import { J6Approval } from "./J6Approval";
import { PboApproval } from "./PboApproval";
import { DirectorateApproval } from "./DirectorateApproval";
import { J8Approval } from "./J8Approval";
import { CardholderValidation } from "./CardholderValidation";
import { RequestorValidation } from "./RequestorValidation";
import { SupplyValidation } from "./SupplyValidation";
import { FinalValidation } from "./FinalValidation";
import { SharepointUser } from "./SharepointUser";
import { ApprovalAction } from "./ApprovalAction";
import { compareDesc, parseISO } from "date-fns";

import { ApprovalActions } from "../../constants/ApprovalActions";
import { getStatusesByFriendlyName } from "../../constants/StepStatus";

export interface IRequestApprovals {
  [key: string]: any;
}
export class RequestApprovals implements IRequestApprovals {
  @autoserializeAs(BudgetOfficerApproval)
  budgetOfficerApproval?: BudgetOfficerApproval;

  @autoserializeAs(BillingOfficialApproval)
  billingOfficialApproval?: BillingOfficialApproval;

  @autoserializeAs(J6Approval)
  j6Approval?: J6Approval;

  @autoserializeAs(PboApproval)
  pboApproval?: PboApproval;

  @autoserializeAs(DirectorateApproval)
  directorateApproval?: DirectorateApproval;

  @autoserializeAs(J8Approval)
  j8Approval?: J8Approval;

  @autoserializeAs(CardholderValidation)
  cardholderValidation?: CardholderValidation;

  @autoserializeAs(RequestorValidation)
  requestorValidation?: RequestorValidation;

  @autoserializeAs(SupplyValidation)
  supplyValidation?: SupplyValidation;

  @autoserializeAs(FinalValidation)
  finalValidation?: FinalValidation;
}

export interface IRequest {
  id?: number;
  requestor: SharepointUser;
  requestField: RequestField;
  purchaseDetails: PurchaseDetails;
  status: string;
  approvals: RequestApprovals;
}

export class Request implements IRequest {
  @autoserialize
  id: number;

  @autoserializeAs(SharepointUser)
  requestor: SharepointUser;

  @autoserializeAs(RequestField)
  requestField: RequestField;

  @autoserializeAs(PurchaseDetails)
  purchaseDetails: PurchaseDetails;

  @autoserialize
  status: string;

  //legacy approvals are stored here
  @autoserializeAs(RequestApprovals)
  approvals: RequestApprovals;

  @autoserializeAs(ApprovalAction)
  history: { [key: string]: ApprovalAction[] };

  @autoserialize
  created: string;

  @autoserializeAs(SharepointUser)
  author: SharepointUser;

  constructor(data: any = {}) {
    this.id = data.id;
    this.requestor = data.requestor || {};
    this.requestField = new RequestField(data.requestField || {});
    this.purchaseDetails = new PurchaseDetails(data.purchaseDetails || {});
    this.status = data.status || "";
    this.approvals = data.approvals || {};
    this.history = data.history || {};
    this.created = data.created || new Date().toISOString();
    this.author = data.author || new SharepointUser();
  }

  public getSortedHistoryDescendingFor(status: string): ApprovalAction[] {
    const sortedHist = this.history[status] || [];
    sortedHist.sort((a, b) => compareDesc(parseISO(a.date), parseISO(b.date)));
    return sortedHist;
  }

  //returns the actions that are available for a request in this status
  public getAvailableActions(): string[] {
    const statuses = getStatusesByFriendlyName();
    const actions = statuses[this.status].actionsAvailable;
    return actions;
  }

  public getLastActionFor(
    status: string,
    actionTypes: string[] = Object.keys(ApprovalActions)
  ): ApprovalAction | null {
    const actionsToMatch = new Set(actionTypes);
    let lastAction = null;
    const sortedDesc = this.getSortedHistoryDescendingFor(status);
    lastAction = sortedDesc.find((action: ApprovalAction) =>
      actionsToMatch.has(action.type)
    );
    return lastAction || null;
  }
}
