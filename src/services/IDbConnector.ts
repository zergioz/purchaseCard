import { Observable } from "rxjs";
import { IQueryParams } from "./IQueryParams";

export interface IDbConnector {
  readTable(params: IQueryParams): Observable<any>;
  createRow(params: IQueryParams): Observable<any>;
  readRow(params: IQueryParams): Observable<any>;
  updateRow(params: IQueryParams): Observable<any>;
  deleteRow(params: IQueryParams): Observable<any>;
  searchUsers(params: IQueryParams): Observable<any>;
  getCurrentUser(): Observable<any>;
}
