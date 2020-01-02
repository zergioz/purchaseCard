import React, { useState } from "react";
import { RequestService } from "../services/RequestService";
import { Request } from "../services/models/Request";
import { IFilters, Filters } from "../components/filters/Filters";
import { getStatusesByFriendlyName } from "../constants/StepStatus";

const statuses = getStatusesByFriendlyName();

export type RequestContextType = {
  requests: Request[];
  filteredRequests: Request[];
  loading: boolean;
  filters: IFilters;
  applyFilters: (filters: IFilters) => Request[];
};

export const RequestContext = React.createContext<RequestContextType>({
  requests: [],
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
