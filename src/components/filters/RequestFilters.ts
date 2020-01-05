import { getStatusesByFriendlyName } from "../../constants/StepStatus";
import { Request } from "../../services/models/Request";

const statuses = getStatusesByFriendlyName();
export interface IRequestFilters {
  directorate: string;
  status: string;
  requestor: string;
  fiscalYear: string;
  keyword: string;
}
export class RequestFilters implements IRequestFilters {
  directorate: string = "";
  status: string = "All Open";
  requestor: string = "";
  fiscalYear: string = "";
  keyword: string = "";
}

interface IRequestFiltering {
  applyFilters: (filters: RequestFilters, requests: Request[]) => Request[];
}

export const useRequestFiltering = (): IRequestFiltering => {
  const applyFilters = (filters: IRequestFilters, requests: Request[]) => {
    let filteredRequests: Request[] = requests
      .filter(request => fiscalYearFilter(request, filters))
      .filter(request => requestorFilter(request, filters))
      .filter(request => statusFilter(request, filters))
      .filter(request => directorateFilter(request, filters))
      .filter(request => keywordFilter(request, filters));
    return filteredRequests;
  };

  const compareStatus = (friendlyStatus: any, listItemStatus: any): boolean => {
    const exactMatch = statuses[friendlyStatus]
      ? statuses[friendlyStatus].caseStep
      : undefined;
    return listItemStatus == exactMatch;
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

  const statusFilter = (request: Request, filters: IRequestFilters) => {
    let match = false;
    if (filters.status == "All Open") {
      match = request.status != "CLOSED";
    } else if (filters.status == "") {
      match = true;
    } else {
      match = compareStatus(filters.status, request.status);
    }
    return match;
  };

  return { applyFilters };
};
