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
  requestor?: SharepointUser;
  requestField?: RequestField;
  purchaseDetails?: PurchaseDetails;
  status?: string;
  approvals?: RequestApprovals;
}

export class Request implements IRequest {
  @autoserialize
  id?: number;

  @autoserializeAs(SharepointUser)
  requestor?: SharepointUser;

  @autoserializeAs(RequestField)
  requestField?: RequestField;

  @autoserializeAs(PurchaseDetails)
  purchaseDetails?: PurchaseDetails;

  @autoserialize
  status?: string;

  @autoserializeAs(RequestApprovals)
  approvals: RequestApprovals;

  @autoserializeAs(ApprovalAction)
  history: { [key: string]: ApprovalAction };

  constructor(data: any = {}) {
    this.id = data.id;
    this.requestor = data.requestor || {};
    this.requestField = data.requestField || {};
    this.purchaseDetails = data.purchaseDetails || {};
    this.status = data.status || "";
    this.approvals = data.approvals || {};
    this.history = data.history || [];
  }
}
