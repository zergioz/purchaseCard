import { Request } from "../../services/models/Request";
import { compose, filter } from "ramda";

export interface IRequestFilters {
  id: number;
  directorate: string;
  status: string;
  requestor: string;
  fiscalYear: string;
  keyword: string;
  type: string;
  rejected: boolean;
}
export class RequestFilters implements IRequestFilters {
  id: number = -1;
  directorate: string = "";
  status: string = "All Open";
  requestor: string = "";
  fiscalYear: string = "";
  keyword: string = "";
  type: string = "";
  rejected: boolean = true;
}

interface IRequestFiltering {
  applyFilters: (filters: RequestFilters, requests: Request[]) => Request[];
}

export const useRequestFiltering = (): IRequestFiltering => {
  const applyFilters = (filters: IRequestFilters, requests: Request[]) => {
    //the ramda library lets us use transducers which make this a lot faster.
    //the filters are executed in the reverse order from which they appear here
    //@ts-ignore
    let filteredRequests: Request[] = compose(
      filter((request: Request) => keywordFilter(request, filters)),
      filter((request: Request) => directorateFilter(request, filters)),
      filter((request: Request) => statusFilter(request, filters)),
      filter((request: Request) => requestorFilter(request, filters)),
      filter((request: Request) => fiscalYearFilter(request, filters)),
      filter((request: Request) => requestTypeFilter(request, filters)),
      //@ts-ignore
      filter((request: Request) => idFilter(request, filters)),
      filter((request: Request) => rejectedFilter(request, filters)),
      filter((request: Request) => request.status !== "")
    )(requests);

    return filteredRequests;
  };

  const directorateFilter = (request: Request, filters: IRequestFilters) => {
    return (
      filters.directorate == "" ||
      request.requestField!.RequestorDirectorate == filters.directorate
    );
  };

  const fiscalYearFilter = (request: Request, filters: IRequestFilters) => {
    let match = false;
    if (filters.fiscalYear == "Empty") {
      match =
        !request.approvals["j8Approval"]! ||
        !request.approvals["j8Approval"]!.j8FiscalYear;
    } else if (filters.fiscalYear == "") {
      match = true;
    } else if (request.approvals["j8Approval"]!) {
      match =
        request.approvals["j8Approval"]!.j8FiscalYear == filters.fiscalYear;
    }
    return match;
  };

  const idFilter = (request: Request, filters: IRequestFilters) => {
    return filters.id == -1 || request.id == filters.id;
  };

  const keywordFilter = (request: Request, filters: IRequestFilters) => {
    const keyword = filters.keyword.toLowerCase();
    return (
      keyword == "" ||
      JSON.stringify(request)
        .toLowerCase()
        .includes(keyword)
    );
  };

  const rejectedFilter = (request: Request, filters: IRequestFilters) => {
    return filters.rejected == false || !request.hasAction(["reject"]);
  };

  const requestorFilter = (request: Request, filters: IRequestFilters) => {
    return (
      filters.requestor == "" || request.requestor!.Name == filters.requestor
    );
  };

  const requestTypeFilter = (request: Request, filters: IRequestFilters) => {
    return (
      filters.type == "" ||
      (filters.type == "Technology" &&
        request.requestField.RequestIsJ6 === "Yes")
    );
  };

  const statusFilter = (request: Request, filters: IRequestFilters) => {
    let match = false;
    if (filters.status == "All Open") {
      match = request.status != "Closed";
    } else if (filters.status == "") {
      match = true;
    } else {
      match = filters.status == request.status;
    }
    return match;
  };

  return { applyFilters };
};
