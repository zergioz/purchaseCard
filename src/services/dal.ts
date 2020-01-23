import { IDbConnector } from "./IDbConnector";
import { Observable } from "rxjs";
import { IQueryParams } from "./IQueryParams";
import { SharepointConnector } from "./sharepoint/SharepointConnector";

export default class dal {
  private db: IDbConnector;

  constructor() {
    this.db = new SharepointConnector();
  }

  readTable(tableName: string, siteUrl?: string): Observable<any> {
    const params = { siteUrl: siteUrl, tableName: tableName } as IQueryParams;

    return this.db.readTable(params);
  }

  getRowsWhere(
    tableName: string,
    siteUrl?: string,
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

  createRow(tableName: string, data: any): Observable<any> {
    const params = { tableName: tableName, rowData: data } as IQueryParams;

    return this.db.createRow(params);
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

  getCurrentUser() {
    return this.db.getCurrentUser();
  }

  searchUsers(query: string, siteUrl?: string) {
    const params = { rawQuery: query, siteUrl: siteUrl } as IQueryParams;

    return this.db.searchUsers(params);
  }

  uploadAttachment(
    listName: string,
    id: number,
    fileName: string,
    file: string | Blob | ArrayBuffer,
    siteUrl?: string
  ) {
    const params = {
      siteUrl: siteUrl,
      tableName: listName,
      id: id,
      fileName: fileName,
      file: file
    } as IQueryParams;

    return this.db.uploadAttachment(params);
  }
}
