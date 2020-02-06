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

  //show cardholder fields in these statuses
  public cardholderFieldStatuses = new Set([
    "Cardholder",
    "Requestor",
    "Supply",
    "PBO Final",
    "BO Final",
    "Closed"
  ]);

  //show j8 fields in these statuses
  public j8FieldStatuses = new Set([
    "Finance",
    "Cardholder",
    "Requestor",
    "Supply",
    "PBO Final",
    "BO Final",
    "Closed"
  ]);

  //add up the line items
  public getTotal = (): number => {
    const items = this.lineItems;
    let sum = 0;
    for (var i = 0; i < items.length; i++) {
      sum += items[i].requestTotal;
    }
    return sum;
  };

  //outputs a string with dollar or euro symbol
  public formatAmount = (amount: number): string => {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency:
        this.requestField.RequestCurrencyType === "Euro" ? "EUR" : "USD",
      minimumFractionDigits: 2
    });
    return formatter.format(amount);
  };

  public getValidationSchema(): Yup.ObjectSchema {
    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
    return Yup.object({
      status: Yup.string(),
      requestField: Yup.object({
        //the dollar sign lets us access the context that we pass in formik.validate
        //we can't access status above because when() only works for siblings and below.
        //fiscalYear, fiscalQuarter are only required for steps Finance and beyond.
        fiscalYear: Yup.string().when("$status", {
          is: value => this.j8FieldStatuses.has(value),
          then: Yup.string().required("Required")
        }),
        //fiscalYear, fiscalQuarter are only required for steps Finance and beyond.
        fiscalQuarter: Yup.string().when("$status", {
          is: value => this.j8FieldStatuses.has(value),
          then: Yup.string().required("Required")
        }),
        //transactionId, executionDate are only required for steps Cardholder and beyond.
        transactionId: Yup.string().when("$status", {
          is: value => this.cardholderFieldStatuses.has(value),
          then: Yup.string().required("Required")
        }),
        //transactionId, executionDate are only required for steps Cardholder and beyond.
        executionDate: Yup.string().when("$status", {
          is: value => this.cardholderFieldStatuses.has(value),
          then: Yup.string().required("Required")
        }),
        RequestCardType: Yup.string()
          .transform(value => (value == "Select" ? undefined : value))
          .required("Required"),
        RequestorCardHolderName: Yup.string()
          .transform(value => (value == "Select" ? undefined : value))
          .required("Required"),
        RequestorDSN: Yup.string()
          .required("Required")
          .matches(phoneRegExp, "Not a valid DSN number"),
        RequestorDirectorate: Yup.string()
          .transform(value => (value == "Select" ? undefined : value))
          .required("Required"),
        RequestSource: Yup.string()
          .transform(value => (value == "Select" ? undefined : value))
          .required("Required"),
        RequestJustification: Yup.string().required("Required"),
        RequestCurrencyType: Yup.string()
          .transform(value => (value == "Select" ? undefined : value))
          .required("Required"),
        RequestIsJ6: Yup.string()
          .transform(value => (value == "Select" ? undefined : value))
          .required("Required")
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
