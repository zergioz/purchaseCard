export interface IQueryParams {
  id: number;
  tableName: string;
  tableType: string;
  columnName: string;
  columnType: string;
  rowData: any;
  viewName: string;
  siteUrl: string;
  rawQuery: string;
  select: string;
  whereClause: string;
}
