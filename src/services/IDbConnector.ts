import { Observable } from "rxjs";
import { IQueryParams } from "./IQueryParams";
import { IEmailProperties } from "./sharepoint/SharepointConnector";

export interface IDbConnector {
  readTable(params: IQueryParams): Observable<any>;
  createRow(params: IQueryParams): Observable<any>;
  readRow(params: IQueryParams): Observable<any>;
  updateRow(params: IQueryParams): Observable<any>;
  deleteRow(params: IQueryParams): Observable<any>;
  searchUsers(params: IQueryParams): Observable<any>;
  getCurrentUser(): Observable<any>;
  uploadAttachment(params: IQueryParams): Observable<any>;
  getAttachments(params: IQueryParams): Observable<any>;
  deleteAttachment(params: IQueryParams): Observable<any>;
  sendEmail(emailProps: IEmailProperties): Observable<any>;
}
