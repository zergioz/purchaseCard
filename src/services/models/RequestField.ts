import { autoserialize } from "cerialize";

// Generated by https://quicktype.io

export class RequestField {
  @autoserialize
  RequestCardType: string;
  @autoserialize
  Requestor: string;
  @autoserialize
  RequestorCardHolderName: string;
  @autoserialize
  RequestorDSN: string;
  @autoserialize
  RequestorDirectorate: string;
  @autoserialize
  RequestSource: string;
  @autoserialize
  RequestJustification: string;
  @autoserialize
  RequestCurrencyType: string;
  @autoserialize
  RequestIsJ6: string;
  @autoserialize
  fiscalYear: string;
  @autoserialize
  fiscalQuarter: string;
  @autoserialize
  purchaseNumber: string;
  @autoserialize
  transactionId: string;
  @autoserialize
  executionDate: string;

  constructor(data: any = {}) {
    this.RequestCardType = data.RequestCardType || "";
    this.RequestCardType = data.RequestCardType || "";
    this.Requestor = data.Requestor || "";
    this.RequestorCardHolderName = data.RequestorCardHolderName || "";
    this.RequestorDSN = data.RequestorDSN || "";
    this.RequestorDirectorate = data.RequestorDirectorate || "";
    this.RequestSource = data.RequestSource || "";
    this.RequestJustification = data.RequestJustification || "";
    this.RequestCurrencyType = data.RequestCurrencyType || "";
    this.RequestIsJ6 = data.RequestIsJ6 === "Yes" ? "Yes" : "No";
    this.fiscalYear = data.fiscalYear || "";
    this.fiscalQuarter = data.fiscalQuarter || "";
    this.purchaseNumber = data.purchaseNumber || "";
    this.transactionId = data.transactionId || "";
    this.executionDate = data.executionDate || "";
  }
}
