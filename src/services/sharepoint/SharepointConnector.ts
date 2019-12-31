import { sp, Web } from "@pnp/sp";
import { Observable, from } from "rxjs";
import { IDbConnector } from "../IDbConnector";
import { IQueryParams } from "../IQueryParams";

export class SharepointConnector implements IDbConnector {
  constructor() {
    this.initialize();
  }

  /// sets up the sp context
  initialize() {
    let _spPageContextInfo: any = {};
    const proxyUrl = "http://localhost:8080"; // sp-rest-proxy's url for a dev project
    // _spPageContextInfo should be mimiced on locally served page
    if (
      !_spPageContextInfo.webServerRelativeUrl ||
      !_spPageContextInfo.webAbsoluteUrl
    ) {
      _spPageContextInfo.webServerRelativeUrl = "/"; // Provide a web's relative URL
      _spPageContextInfo.webAbsoluteUrl = `${proxyUrl}${_spPageContextInfo.webServerRelativeUrl}`;
    }

    // PnP JS Core setup
    sp.setup({
      sp: {
        headers: {
          Accept: "application/json;odata=verbose"
        }
      }
      // `baseUrl` with `_spPageContextInfo.webAbsoluteUrl` can be used
      // or strict Web object creation as shown below
    });

    // Create new Web object with `webAbsoluteUrl` to proxy
    //let web = new Web(_spPageContextInfo.webAbsoluteUrl);
  }

  /// queries all the rows of a sharepoint list
  readTable(params: IQueryParams): Observable<any> {
    const tableName = params.tableName;
    const siteUrl = params.siteUrl;
    const select = params.select || "";
    const filter = params.whereClause || "";
    let web = sp.web;
    if (siteUrl) web = new Web(siteUrl);

    return from(
      web.lists
        .getByTitle(tableName)
        .items.select(select)
        .filter(filter)
        .top(10000)
        .get()
    );
  }

  /// creates a new sharepoint list item
  createRow(params: IQueryParams): Observable<any> {
    const listName = params.tableName;
    const data = { Title: params.rowData.Title || "Title", ...params.rowData };

    return from(sp.web.lists.getByTitle(listName).items.add(data));
  }

  /// gets a list item by id
  readRow(params: IQueryParams): Observable<any> {
    const listName = params.tableName;
    const itemId = params.id;

    return from(
      sp.web.lists
        .getByTitle(listName)
        .items.getById(itemId)
        .get()
    );
  }

  /// updates an existing list item by id
  updateRow(params: IQueryParams): Observable<any> {
    const listName = params.tableName;
    const itemId = params.rowData.Id;
    const list = sp.web.lists.getByTitle(listName);
    const data = { Title: params.rowData.Title || "Title", ...params.rowData };

    return from(list.items.getById(itemId).update(data));
  }

  /// deletes a sharepoint list item by id
  deleteRow(params: IQueryParams): Observable<any> {
    const listName = params.tableName;
    const itemId = params.id;
    const list = sp.web.lists.getByTitle(listName);

    return from(list.items.getById(itemId).delete());
  }

  searchUsers(params: IQueryParams): Observable<any> {
    const query = params.rawQuery;
    const siteUrl = params.siteUrl;
    let web = sp.web;
    if (siteUrl) web = new Web(siteUrl);

    return from(
      web.siteUserInfoList.items
        .filter(
          query
            ? `substringof('${query}',Title) or substringof('${query}',EMail)`
            : ``
        )
        .top(10000)
        .select("Id, Title, EMail, Name, UserName")
        .orderBy("Title")
        .get()
    );
  }

  getCurrentUser(): Observable<any> {
    return from(sp.web.currentUser.get());
  }
}
