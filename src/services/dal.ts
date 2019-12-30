import { IDbConnector } from "./IDbConnector";
import { Observable } from "rxjs";
import { IQueryParams } from "./IQueryParams";
import { SharepointConnector } from "./sharepoint/SharepointConnector";

export default class dal {
  private db: IDbConnector;

  constructor() {
    this.db = new SharepointConnector();
  }

  createTable(tableName: string): Observable<any> {
    const params = { tableName: tableName } as IQueryParams;

    return this.db.createTable(params);
  }

  readTable(tableName: string, siteUrl?: string): Observable<any> {
    const params = { siteUrl: siteUrl, tableName: tableName } as IQueryParams;

    return this.db.readTable(params);
  }

  addColumnToTable(
    tableName: string,
    columnName: string,
    columnType?: string
  ): Observable<any> {
    const params = {
      tableName: tableName,
      columnName: columnName,
      columnType: columnType
    } as IQueryParams;

    return this.db.addColumnToTable(params);
  }

  getRowsWhere(
    siteUrl: string,
    tableName: string,
    select?: string,
    whereClause?: string
  ): Observable<any> {
    const params = {
      siteUrl: siteUrl,
      tableName: tableName,
      select: select || ``,
      whereClause: whereClause || ``
    } as IQueryParams;

    return this.db.readTable(params);
  }

  getDefaultView(tableName: string): Observable<any> {
    const params = {
      tableName: tableName
    } as IQueryParams;

    return this.db.getDefaultView(params);
  }

  addColumnToView(tableName: string, columnName: string): Observable<any> {
    const params = {
      columnName: columnName,
      tableName: tableName
    } as IQueryParams;

    return this.db.addColumnToView(params);
  }

  createRow(tableName: string, data: any): Observable<any> {
    const params = { tableName: tableName, rowData: data } as IQueryParams;

    return this.db.createRow(params);
  }

  readColumn(tableName: string, columnName: string): Observable<any> {
    const params = {
      tableName: tableName,
      columnName: columnName
    } as IQueryParams;

    return this.db.readColumn(params);
  }

  readRow(tableName: string, id: number): Observable<any> {
    const params = { tableName: tableName, id: id } as IQueryParams;

    return this.db.readRow(params);
  }

  updateRow(tableName: string, data: any): Observable<any> {
    const params = { tableName: tableName, rowData: data } as IQueryParams;

    return this.db.updateRow(params);
  }

  deleteRow(tableName: string, id: number): Observable<any> {
    const params = { tableName: tableName, id: id } as IQueryParams;

    return this.db.deleteRow(params);
  }

  searchUsers(query: string, siteUrl?: string) {
    const params = { rawQuery: query, siteUrl: siteUrl } as IQueryParams;

    return this.db.searchUsers(params);
  }

  sendRawQuery(params: IQueryParams) {
    return this.db.sendRawQuery(params);
  }
}
