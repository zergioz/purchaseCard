import { Observable } from "rxjs";
import { IQueryParams } from "./IQueryParams";

export interface IDbConnector {
  createTable(params: IQueryParams): Observable<any>;
  readTable(params: IQueryParams): Observable<any>;
  addColumnToTable(params: IQueryParams): Observable<any>;
  readColumn(params: IQueryParams): Observable<any>;
  addColumnToView(params: IQueryParams): Observable<any>;
  createRow(params: IQueryParams): Observable<any>;
  readRow(params: IQueryParams): Observable<any>;
  updateRow(params: IQueryParams): Observable<any>;
  deleteRow(params: IQueryParams): Observable<any>;
  getDefaultView(params: IQueryParams): Observable<any>;
  sendRawQuery(params: IQueryParams): Observable<any>;
  searchUsers(params: IQueryParams): Observable<any>;
  getCurrentUser(): Observable<any>;
}
