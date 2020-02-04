import { autoserializeAs } from "cerialize";
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
