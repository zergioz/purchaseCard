import { Request } from "../../services/models/Request";

export interface IRequestFilters {
  directorate: string;
  status: string;
  requestor: string;
  fiscalYear: string;
  keyword: string;
  type: string;
}
export class RequestFilters implements IRequestFilters {
  directorate: string = "";
  status: string = "All Open";
  requestor: string = "";
  fiscalYear: string = "";
  keyword: string = "";
  type: string = "";
}

interface IRequestFiltering {
  applyFilters: (filters: RequestFilters, requests: Request[]) => Request[];
}

export const useRequestFiltering = (): IRequestFiltering => {
  const applyFilters = (filters: IRequestFilters, requests: Request[]) => {
    let filteredRequests: Request[] = requests
      .filter(request => requestTypeFilter(request, filters))
      .filter(request => fiscalYearFilter(request, filters))
      .filter(request => requestorFilter(request, filters))
      .filter(request => statusFilter(request, filters))
      .filter(request => directorateFilter(request, filters))
      .filter(request => keywordFilter(request, filters));
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
      match = !request.j8Approval || !request.j8Approval.j8FiscalYear;
    } else if (filters.fiscalYear == "") {
      match = true;
    } else if (request.j8Approval) {
      match = request.j8Approval.j8FiscalYear == filters.fiscalYear;
    }
    return match;
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

  const requestorFilter = (request: Request, filters: IRequestFilters) => {
    return filters.requestor == "" || request.requestor == filters.requestor;
  };

  const requestTypeFilter = (request: Request, filters: IRequestFilters) => {
    return (
      filters.type == "" ||
      (filters.type == "Technology" && request.requestField!.RequestIsJ6)
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
