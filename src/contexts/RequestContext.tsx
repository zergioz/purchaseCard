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
  applyFilters: (filters: IFilters) => Request[];
};

export const RequestContext = React.createContext<RequestContextType>({
  requests: [],
  updateRequests: (requests: Request[]) => null,
  subscribeTo: (observable: Observable<Request[]>) => null,
  filteredRequests: [],
  loading: true,
  filters: new Filters(),
  applyFilters: (filters: IFilters) => []
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

  const requestorFilter = (request: Request, filters: IFilters) => {
    return filters.requestor == "" || request.requestor == filters.requestor;
  };

  const statusFilter = (request: Request, filters: IFilters) => {
    return (
      filters.status == "" || compareStatus(filters.status, request.status)
    );
  };

  const subscribeTo = (observable: Observable<Request[]>) => {
    updateLoading(true);
    observable.subscribe(requests => {
      updateRequests(requests);
      updateLoading(false);
    });
  };

  const compareStatus = (friendlyStatus: any, listItemStatus: any): boolean => {
    const resolvedStatus = statuses[friendlyStatus].caseStep;
    return listItemStatus == resolvedStatus;
  };

  const applyFilters = (filters: IFilters) => {
    let filteredRequests: Request[] = requests
      .filter(request => requestorFilter(request, filters))
      .filter(request => statusFilter(request, filters))
      .filter(request => directorateFilter(request, filters));
    updateFilteredRequests(filteredRequests);
    updateFilters(filters);
    console.log(`Filters applied`, filters, filteredRequests.length);
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
