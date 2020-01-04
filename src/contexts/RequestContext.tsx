import React, { useState } from "react";
import { Request } from "../services/models/Request";
import { IFilters, Filters } from "../components/filters/Filters";
import { getStatusesByFriendlyName } from "../constants/StepStatus";
import { Observable } from "rxjs/internal/Observable";

const statuses = getStatusesByFriendlyName();

export type RequestContextType = {
  requests: Request[];
  updateRequests: (requests: Request[]) => void;
  subscribeTo: (observable: Observable<Request[]>) => void;
  filteredRequests: Request[];
  loading: boolean;
  filters: IFilters;
  applyFilters: (filters: IFilters, update: boolean) => Request[];
};

export const RequestContext = React.createContext<RequestContextType>({
  requests: [],
  updateRequests: (requests: Request[]) => null,
  subscribeTo: (observable: Observable<Request[]>) => null,
  filteredRequests: [],
  loading: true,
  filters: new Filters(),
  applyFilters: (filters: IFilters, update: boolean) => []
});

export const RequestProvider: React.FC = (props: any) => {
  const [requests, updateRequests] = useState<Request[]>([]);
  const [filteredRequests, updateFilteredRequests] = useState<Request[]>(
    requests
  );
  const [loading, updateLoading] = useState<boolean>(false);
  const [filters, updateFilters] = useState<IFilters>(new Filters());

  const directorateFilter = (request: Request, filters: IFilters) => {
    return (
      filters.directorate == "" ||
      request.requestField!.RequestorDirectorate == filters.directorate
    );
  };

  const fiscalYearFilter = (request: Request, filters: IFilters) => {
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

  const requestorFilter = (request: Request, filters: IFilters) => {
    return filters.requestor == "" || request.requestor == filters.requestor;
  };

  const statusFilter = (request: Request, filters: IFilters) => {
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

  const subscribeTo = (observable: Observable<Request[]>) => {
    updateLoading(true);
    observable.subscribe(requests => {
      updateRequests(requests);

      //debounce so the status filter doesn't flicker
      setTimeout(() => {
        updateLoading(false);
      }, 500);
    });
  };

  const compareStatus = (friendlyStatus: any, listItemStatus: any): boolean => {
    const exactMatch = statuses[friendlyStatus]
      ? statuses[friendlyStatus].caseStep
      : undefined;
    return listItemStatus == exactMatch;
  };

  const applyFilters = (filters: IFilters, update: boolean = true) => {
    let filteredRequests: Request[] = requests
      .filter(request => fiscalYearFilter(request, filters))
      .filter(request => requestorFilter(request, filters))
      .filter(request => statusFilter(request, filters))
      .filter(request => directorateFilter(request, filters));
    if (update) {
      updateFilteredRequests(filteredRequests);
      updateFilters(filters);
      console.log(`Filters applied`, filters, filteredRequests.length);
    }
    return filteredRequests;
  };

  return (
    <RequestContext.Provider
      value={{
        requests: requests,
        updateRequests: updateRequests,
        subscribeTo: subscribeTo,
        filteredRequests: filteredRequests,
        loading: loading,
        filters: filters,
        applyFilters: applyFilters
      }}
    >
      {props.children}
    </RequestContext.Provider>
  );
};

export default RequestContext;
