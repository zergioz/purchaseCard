export interface IFilters {
  directorate: string;
  status: string;
  requestor: string;
  fiscalYear: string;
}
export class Filters implements IFilters {
  directorate: string = "";
  status: string = "";
  requestor: string = "";
  fiscalYear: string = "";
}
