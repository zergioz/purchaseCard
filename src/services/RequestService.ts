import dal from "./dal";
import { ISerializer } from "./ISerializer";
import { JsonStringSerializer } from "./JsonStringSerializer";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { Request } from "./models/Request";
import { ccRequestTracker } from "./models/interfaces/ccRequestTracker";
import { convertToFriendly } from "../constants/StepStatus";
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

  //doing this because some of the data written to the DB was not done with JSON.stringify
  mapAndParse(item: ccRequestTracker): any {
    let parsed = {};
    try {
      let approvals = {
        directorateApproval: JSON.parse(item.DIRECTORATE_APPROVAL),
        billingOfficialApproval: JSON.parse(item.BILLING_OFFICIAL_APPROVAL), //bo
        j6Approval: JSON.parse(item.J6_APPROVAL),
        pboApproval: JSON.parse(item.PBO_APPROVAL),
        j8Approval: JSON.parse(item.J8_APPROVAL),
        cardholderValidation: JSON.parse(item.CARD_HOLDER_VALIDATION),
        requestorValidation: JSON.parse(item.REQUESTOR_VALIDATION),
        supplyValidation: JSON.parse(item.SUPPLY_VALIDATION),
        budgetOfficerApproval: JSON.parse(item.BUDGET_OFFICER_APPROVAL), //pbofinal
        finalValidation: JSON.parse(item.FINAL_VALIDATION) //bofinal
      };
      parsed = {
        id: item.Id,
        requestor: item.Author,
        requestField: JSON.parse(item.REQUEST_FIELD),
        purchaseDetails: JSON.parse(item.PURCHASE_DETAILS),
        status: convertToFriendly(item.REQUEST_STATUS),
        approvals: approvals,
        history: item.History
          ? JSON.parse(item.History)
          : convertApprovalsToHistory(approvals)
      };
    } catch (e) {
      console.error(`Error parsing value in ccRequestTracker item`, e);
      console.error(item);
    }
    return JSON.stringify(parsed);
  }

  read(filters?: string): Observable<Request[]> {
    const select = `Id,Title,REQUEST_FIELD,PURCHASE_DETAILS,BUDGET_OFFICER_APPROVAL,BILLING_OFFICIAL_APPROVAL,J6_APPROVAL,PBO_APPROVAL,DIRECTORATE_APPROVAL,J8_APPROVAL,CARD_HOLDER_VALIDATION,REQUESTOR_VALIDATION,SUPPLY_VALIDATION,FINAL_VALIDATION,REQUEST_STATUS`;

    return this.dal
      .getRowsWhere(this.listName, undefined, select, filters)
      .pipe(
        //tap((items: any) => console.log(items)),
        //parse nested json strings
        map((items: ccRequestTracker[]) => {
          return items.map(item => this.mapAndParse(item));
        }),
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
      );
  }
}
