import { autoserializeAs, autoserialize } from "cerialize";
import {
  RequestField,
  PurchaseDetails,
  BudgetOfficerApproval,
  BillingOfficialApproval,
  J6Approval,
  PboApproval,
  DirectorateApproval,
  J8Approval,
  CardholderValidation,
  RequestorValidation,
  SupplyValidation,
  FinalValidation
} from ".";

export class Request {
  @autoserialize
  requestor?: string;

  @autoserializeAs(RequestField)
  requestField?: RequestField;

  @autoserializeAs(PurchaseDetails)
  purchaseDetails?: PurchaseDetails;

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

  @autoserialize
  status?: string;

  constructor(data: any = {}) {}
}
