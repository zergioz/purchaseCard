import { autoserializeAs, autoserialize } from "cerialize";
import { RequestField } from "./RequestField";
import { LineItem } from "./LineItem";
import { SharepointUser } from "./SharepointUser";
import { ApprovalAction } from "./ApprovalAction";
import { compareDesc, parseISO, differenceInDays } from "date-fns";
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

  @autoserialize
  expireAfterDays: number;

  //holds values like $0.00 and #134 so keyword search can find it
  @autoserialize
  searchKeywords: string[];

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
    this.expireAfterDays = 30;

    //keyword search works by stringifying this object.
    //add the $total and the id #123 here so that those will match if user searches that way
    this.searchKeywords = [this.formatAmount(this.getTotal()), `#${this.id}`];
  }

  //looks at the last approval for each status and returns true if it finds a match
  public hasAction = (
    actions: string[],
    statuses: string[] = Object.keys(getStatusesByFriendlyName())
  ): boolean => {
    let match = false;
    statuses.map(status => {
      if (this.getLastActionFor(status, actions)) match = true;
    });
    return match;
  };

  //quotes have to be less than 30 days old for cardholder to purchase
  public isExpired = (): boolean => {
    let expired = false;
    try {
      const submitted = parseISO(this.created);
      const age = differenceInDays(new Date(), submitted);
      const tooOld = age > this.expireAfterDays;
      const alreadyPurchased = this.isPast("Cardholder");
      expired = tooOld && !alreadyPurchased;
    } catch (e) {
      console.error(`isExpired(${this.id}): `, e);
    }
    return expired;
  };

  //this request has moved beyond the given status
  public isPast = (step: string, inclusive?: boolean): boolean => {
    const statuses = Object.keys(getStatusesByFriendlyName());
    const currentStep = statuses.indexOf(this.status);
    const matchIndex = inclusive
      ? statuses.indexOf(step)
      : statuses.indexOf(step) + 1;
    return currentStep >= matchIndex;
  };

  //this is the data we'll save to the csv export
  public getExportData(): any {
    return {
      id: this.id,
      requestor: this.author.Title,
      requestorPhone: this.requestField.RequestorDSN,
      directorate: this.requestField.RequestorDirectorate,
      submitted: this.created,
      requiredJ6Approval: this.requestField.RequestIsJ6 == "Yes" ? true : false,
      dd250: this.lineItems.find(item => item.requestDdForm) !== undefined,
      da2062: this.lineItems.find(item => item.requestDaForm) !== undefined,
      //lineItems: JSON.stringify(this.lineItems),
      currency: this.requestField.RequestCurrencyType,
      total: this.getTotal(),
      totalFormatted: this.formatAmount(this.getTotal()),
      //approvalHistory: JSON.stringify(this.history),
      status: this.status,
      rejected: this.hasAction(["reject"]),
      completed: this.getLastActionFor("BO Final", ["approve"]) ? true : false,
      cardType: this.requestField.RequestCardType,
      cardHolder: this.requestField.RequestorCardHolderName,
      justification: this.requestField.RequestJustification,
      fundingType: this.requestField.RequestSource,
      executionDate: this.requestField.executionDate,
      transactionId: this.requestField.transactionId,
      fiscalQuarter: this.requestField.fiscalQuarter,
      fiscalYear: this.requestField.fiscalYear,
      url: `${window.location.protocol}//${window.location.host}/app/gpc/#/requests/details/${this.id}`
    };
  }

  public getSortedHistoryDescendingFor(status: string): ApprovalAction[] {
    const sortedHist = this.history[status] || [];
    sortedHist.sort((a, b) => compareDesc(parseISO(a.date), parseISO(b.date)));
    return sortedHist;
  }

  //returns the actions that are available for a request in this status
  public getAvailableActions(): string[] {
    const statuses = getStatusesByFriendlyName();
    const status = this.status == "" ? "Draft" : this.status;
    const actions = statuses[status].actionsAvailable;
    return actions;
  }

  //gets the last approval action that was taken at a step
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
