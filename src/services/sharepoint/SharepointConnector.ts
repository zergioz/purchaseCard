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

  /// creates a new sharepoint list
  createTable(params: IQueryParams): Observable<any> {
    const listName = params.tableName;
    return from(sp.web.lists.add(listName));
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

  /// adds a multi line text field to a sharepoint list and then adds that column to the default view
  addColumnToTable(params: IQueryParams): Observable<any> {
    const listName = params.tableName;
    const fieldName = params.columnName;

    return from(
      sp.web.lists
        .getByTitle(listName)
        .fields.addMultilineText(
          fieldName,
          undefined,
          false,
          false,
          false,
          false
        )
    );
  }

  /// gets the information about a column in a sharepoint list
  readColumn(params: IQueryParams): Observable<any> {
    const listName = params.tableName;
    const fieldName = params.columnName;

    return from(
      sp.web.lists
        .getByTitle(listName)
        .fields.select("InternalName")
        .getByInternalNameOrTitle(fieldName)
        .get()
    );
  }

  //adds a column to the All Items view
  addColumnToView(params: IQueryParams): Observable<any> {
    const listName = params.tableName;
    const fieldName = params.columnName;

    return from(
      sp.web.lists.getByTitle(listName).defaultView.fields.add(fieldName)
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

  //gets the details of the default view for a list
  getDefaultView(params: IQueryParams): Observable<any> {
    const listName = params.tableName;
    const list = sp.web.lists.getByTitle(listName);

    return from(list.defaultView.expand("ViewFields").get());
  }

  //for sending caml for calendar queries
  sendRawQuery(params: IQueryParams): Observable<any> {
    const caml = params.rawQuery;

    const siteUrl = params.siteUrl;
    let web = sp.web;
    if (siteUrl) web = new Web(siteUrl);

    const listName = params.tableName;

    return from(web.lists.getByTitle(listName).renderListData(caml));
  }

  //gets info from the users list - used by <PeoplePicker> component
  searchUsers(params: IQueryParams): Observable<any> {
    const query = params.rawQuery;
    const siteUrl = params.siteUrl;
    let web = sp.web;
    if (siteUrl) web = new Web(siteUrl);

    return from(
      web.siteUserInfoList.items
        .filter(
          `substringof('${query}',Title) or substringof('${query}',EMail)`
        )
        .select("Id, Title, EMail")
        .orderBy("Title")
        .get()
    );
  }

  //for profile info and <AdminOnly> component
  getCurrentUser(): Observable<any> {
    return from(sp.web.currentUser.get());
  }
}
