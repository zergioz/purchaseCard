import { autoserializeAs, autoserialize } from "cerialize";
import { RequestField } from "./RequestField";
import { LineItem } from "./LineItem";
import { SharepointUser } from "./SharepointUser";
import { ApprovalAction } from "./ApprovalAction";
import { compareDesc, parseISO } from "date-fns";
import { ApprovalActions } from "../../constants/ApprovalActions";
import { getStatusesByFriendlyName } from "../../constants/StepStatus";
import { RequestApprovals } from "./RequestApprovals";
import * as Yup from "yup";

export interface IRequest {
  id?: number;
  requestor: SharepointUser;
  requestField: RequestField;
  lineItems: LineItem[];
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

  @autoserializeAs(LineItem)
  lineItems: LineItem[];

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
    this.lineItems = data.lineItems
      ? data.lineItems.map((item: any) => new LineItem(item))
      : [];
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

  public getValidationSchema() {
    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
    Yup.object({
      requestField: Yup.object({
        //fiscalYear: Yup.string().required("Required"),
        //fiscalQuarter: Yup.string().required("Required")
        //transactionId: Yup.string().required("Required"),
        //executionDate: Yup.string().required("Required"),
        RequestCardType: Yup.string().required("Required"),
        RequestorCardHolderName: Yup.string().required("Required"),
        RequestorDSN: Yup.string()
          .required("Required")
          .matches(phoneRegExp, "Not a valid DSN number"),
        RequestorDirectorate: Yup.string().required("Required"),
        RequestSource: Yup.string().required("Required"),
        RequestJustification: Yup.string().required("Required"),
        RequestCurrencyType: Yup.string().required("Required"),
        RequestIsJ6: Yup.string().required("Required")
      }),
      lineItems: Yup.array().of(
        Yup.object({
          requestQty: Yup.number()
            .positive("Can't be negative")
            .transform(value => (isNaN(value) ? undefined : value))
            .required("Required"),
          requestCost: Yup.number()
            .positive("Can't be negative")
            .transform(value => (isNaN(value) ? undefined : value))
            .required("Required"),
          requestDesc: Yup.string().required("Required"),
          requestSrc: Yup.string().required("Required"),
          requestDdForm: Yup.boolean(),
          requestDaForm: Yup.boolean()
        })
      )
    });
  }
}
