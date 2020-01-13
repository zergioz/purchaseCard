import dal from "./dal";
import { ISerializer } from "./ISerializer";
import { JsonStringSerializer } from "./JsonStringSerializer";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { Request } from "./models/Request";
import { ccRequestTracker } from "./models/interfaces/ccRequestTracker";
import { convertToFriendly, convertToUgly } from "../constants/StepStatus";
import { convertApprovalsToHistory } from "../helpers/ApprovalsToHistory";

export class RequestService {
  private dal: dal;
  private serializer: ISerializer;
  private listName: string;

  constructor() {
    this.dal = new dal();
    this.serializer = new JsonStringSerializer();
    this.listName = "ccRequestTracker";
  }

  /*
  * doing all this re-shaping because this app was built on a pre-existing non-optimal
  * schema.  after we're up and running we probably need to write some migrations
  * to dump our production data into a new list.

  * the existing list is full of multiline text fields which are not filterable with SP
  * rest queries.  to get around this we are currently pulling all data and doing filtering
  * on the client side.  with the current volume of gpc requests, this will get bad very quickly.
  */

  //todo: write some migrations and dump all of our data into a new list with correctly typed fields
  mapAndParse(item: ccRequestTracker): any {
    let parsed = {};
    try {
      let approvals = {
        directorateApproval: item.DIRECTORATE_APPROVAL
          ? JSON.parse(item.DIRECTORATE_APPROVAL)
          : null,
        billingOfficialApproval: item.BILLING_OFFICIAL_APPROVAL
          ? JSON.parse(item.BILLING_OFFICIAL_APPROVAL)
          : null, //bo
        j6Approval: item.J6_APPROVAL ? JSON.parse(item.J6_APPROVAL) : null,
        pboApproval: item.PBO_APPROVAL ? JSON.parse(item.PBO_APPROVAL) : null,
        j8Approval: item.J8_APPROVAL ? JSON.parse(item.J8_APPROVAL) : null,
        cardholderValidation: item.CARD_HOLDER_VALIDATION
          ? JSON.parse(item.CARD_HOLDER_VALIDATION)
          : null,
        requestorValidation: item.REQUESTOR_VALIDATION
          ? JSON.parse(item.REQUESTOR_VALIDATION)
          : null,
        supplyValidation: item.SUPPLY_VALIDATION
          ? JSON.parse(item.SUPPLY_VALIDATION)
          : null,
        budgetOfficerApproval: item.BUDGET_OFFICER_APPROVAL
          ? JSON.parse(item.BUDGET_OFFICER_APPROVAL)
          : null, //pbofinal
        finalValidation: item.FINAL_VALIDATION
          ? JSON.parse(item.FINAL_VALIDATION)
          : null //bofinal
      };

      /* RESHAPING
       * in the old app, some form field data was stored nested
       * in the legacy approvals object (above).
       *
       * if this is the case, pull these 4 fields out and store them with
       * the rest of the form data for consistency
       */
      let requestField = item.REQUEST_FIELD
        ? JSON.parse(item.REQUEST_FIELD)
        : {};
      requestField = {
        ...requestField,
        fiscalYear:
          requestField.fiscalYear ||
          (approvals.j8Approval && approvals.j8Approval.j8FiscalYear)
            ? approvals.j8Approval.j8FiscalYear
            : "",
        fiscalQuarter:
          requestField.fiscalQuarter ||
          (approvals.j8Approval && approvals.j8Approval.j8Quater)
            ? approvals.j8Approval.j8Quater
            : "",
        transactionId:
          requestField.transactionId ||
          (approvals.cardholderValidation &&
            approvals.cardholderValidation.cardHolderTransactionId)
            ? approvals.cardholderValidation.cardHolderTransactionId
            : "",
        executionDate:
          requestField.executionDate ||
          (approvals.cardholderValidation &&
            approvals.cardholderValidation.cardHolderExecuted)
            ? approvals.cardholderValidation.cardHolderExecuted
            : ""
      };

      /*
       * this is the core data that we care about on a request.
       *
       * the gpc specific fields are stored in the requestField and purchaseDetails objects.
       *
       * future versions of this app
       * used for other purposes should probably break requestField and purchaseDetails out
       * and store that stuff in its own list which is referenced from here.
       *
       * then a "Request" could be repurposed for any type of form/packet that needs to go through
       * a pipeline of approvals
       */
      //todo: store requestField and purchaseDetails stuff in their own list, reference the item id from here
      parsed = {
        id: item.Id,
        requestor: item.Author,
        requestField: requestField,
        purchaseDetails: item.PURCHASE_DETAILS
          ? JSON.parse(item.PURCHASE_DETAILS)
          : {},
        status: convertToFriendly(item.REQUEST_STATUS),
        approvals: approvals,
        history: item.History
          ? JSON.parse(item.History)
          : convertApprovalsToHistory(approvals),
        created: item.Created,
        author: item.Author
      };
    } catch (e) {
      console.error(`Error parsing value in ccRequestTracker item`, e);
      console.error(item);
    }
    return JSON.stringify(parsed);
  }

  read(filters?: string): Observable<Request[]> {
    const select = `Id,Title,Created,REQUEST_FIELD,PURCHASE_DETAILS,BUDGET_OFFICER_APPROVAL,BILLING_OFFICIAL_APPROVAL,J6_APPROVAL,PBO_APPROVAL,DIRECTORATE_APPROVAL,J8_APPROVAL,CARD_HOLDER_VALIDATION,REQUESTOR_VALIDATION,SUPPLY_VALIDATION,FINAL_VALIDATION,REQUEST_STATUS,History`;

    return this.dal
      .getRowsWhere(this.listName, undefined, select, filters)
      .pipe(
        //tap((items: any) => console.log(items)),
        //parse nested json strings
        map((items: ccRequestTracker[]) => {
          return items.map(item => this.mapAndParse(item));
        }),
        //tap((items: any) => console.log(items)),
        //hydrate each into an instance of the Request class
        map((items: any[]) => {
          let deserialized: Array<Request> = [];
          items.forEach(item => {
            deserialized.push(
              new Request(this.serializer.deserialize(item, Request))
            );
          });
          return deserialized;
        })
        //tap((items: any) => console.log(items))
      );
  }

  createDraft(): Observable<Request> {
    const requestData = {
      // REQUEST_FIELD: {},
      // PURCHASE_DETAILS: {},
      // BUDGET_OFFICER_APPROVAL: {},
      // BILLING_OFFICIAL_APPROVAL: {},
      // J6_APPROVAL: {},
      // PBO_APPROVAL: {},
      // DIRECTORATE_APPROVAL: {},
      // J8_APPROVAL: {},
      // CARD_HOLDER_VALIDATION: {},
      // REQUESTOR_VALIDATION: {},
      // SUPPLY_VALIDATION: {},
      // FINAL_VALIDATION: {},
      REQUEST_STATUS: "DRAFT"
    };
    return this.dal.createRow(this.listName, requestData).pipe(
      //tap((items: any) => console.log(items)),
      //parse nested json strings
      map((item: any) => this.mapAndParse(item.data)),
      //tap((items: any) => console.log(items)),
      //hydrate each into an instance of the Request class
      map((item: any) => {
        let deserialized: Request = new Request(
          this.serializer.deserialize(item, Request)
        );
        return deserialized;
      })
      //tap((items: any) => console.log(items))
    );
  }

  //! quick fix to give them a "Send To" option while we're still using the old form
  update(request: Request): Observable<Request> {
    const requestData = {
      Id: request.id,
      REQUEST_STATUS: convertToUgly(request.status),
      History: JSON.stringify(request.history || {})
    };
    console.log(`Updating`, requestData);
    return this.dal.updateRow(this.listName, requestData).pipe(
      //tap((items: any) => console.log(items)),
      //parse nested json strings
      map((item: any) => this.mapAndParse(item.data)),
      //tap((items: any) => console.log(items)),
      //hydrate each into an instance of the Request class
      map((item: any) => {
        let deserialized: Request = new Request(
          this.serializer.deserialize(item, Request)
        );
        return deserialized;
      })
      //tap((items: any) => console.log(items))
    );
  }
}
