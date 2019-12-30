import dal from "./dal";
import { ISerializer } from "./ISerializer";
import { JsonStringSerializer } from "./JsonStringSerializer";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { Request } from "./models/Request";
import { ccRequestTracker } from "./models/interfaces/ccRequestTracker";
import { SharepointUser } from "./models/SharepointUser";

export class RequestService {
  private dal: dal;
  private serializer: ISerializer;
  private listName: string;

  constructor() {
    this.dal = new dal();
    this.serializer = new JsonStringSerializer();
    this.listName = "ccRequestTracker";
  }

  mapAndParse(item: ccRequestTracker): any {
    let parsed = {};
    try {
      parsed = JSON.stringify({
        id: item.Id,
        requestor: item.Title,
        requestField: JSON.parse(item.REQUEST_FIELD),
        purchaseDetails: JSON.parse(item.PURCHASE_DETAILS),
        budgetOfficerApproval: JSON.parse(item.BUDGET_OFFICER_APPROVAL),
        billingOfficialApproval: JSON.parse(item.BILLING_OFFICIAL_APPROVAL),
        j6Approval: JSON.parse(item.J6_APPROVAL),
        pboApproval: JSON.parse(item.PBO_APPROVAL),
        directorateApproval: JSON.parse(item.DIRECTORATE_APPROVAL),
        j8Approval: JSON.parse(item.J8_APPROVAL),
        cardholderValidation: JSON.parse(item.CARD_HOLDER_VALIDATION),
        requestorValidation: JSON.parse(item.REQUESTOR_VALIDATION),
        supplyValidation: JSON.parse(item.SUPPLY_VALIDATION),
        finalValidation: JSON.parse(item.FINAL_VALIDATION),
        status: item.REQUEST_STATUS
      });
    } catch (e) {
      console.log(`Error parsing ccRequestTracker item`, e, item);
    }
    return parsed;
  }

  read(filters?: string): Observable<Request[]> {
    return this.dal
      .getRowsWhere(this.listName, undefined, undefined, filters)
      .pipe(
        tap(items => console.log(items)),
        //parse nested json strings
        map((items: ccRequestTracker[]) => {
          return items.map(item => this.mapAndParse(item));
        }),
        //hydrate each into an instance of the Request class
        map((items: any[]) => {
          let deserialized: Array<Request> = [];
          items.forEach(item => {
            deserialized.push(this.serializer.deserialize(item, Request));
          });
          return deserialized;
        }),
        tap(items => console.log(items))
      );
  }
}
