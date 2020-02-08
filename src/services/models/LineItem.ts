import { autoserialize } from "cerialize";
import { getRandomString } from "@pnp/common";

// Generated by https://quicktype.io

export class LineItem {
  @autoserialize
  id: string;
  @autoserialize
  requestQty: number;

  @autoserialize
  requestDesc: string;
  @autoserialize
  requestSrc: string;
  @autoserialize
  requestDdForm: boolean;
  @autoserialize
  requestDaForm: boolean;
  @autoserialize
  requestCost: number;
  @autoserialize
  requestTotal: number;

  constructor(data: any = {}) {
    this.id = data.id || getRandomString(8);
    this.requestQty = parseFloat(data.requestQty) || 0;
    this.requestDesc = data.requestDesc || "";
    this.requestSrc = data.requestSrc || "";
    this.requestDdForm =
      data.requestDdForm === "true" || data.requestDdForm === true
        ? true
        : false;
    this.requestDaForm =
      data.requestDaForm === "true" || data.requestDaForm === true
        ? true
        : false;
    this.requestCost = parseFloat(data.requestCost) || 0;
    this.requestTotal = parseFloat(data.requestTotal) || 0;
  }
}
