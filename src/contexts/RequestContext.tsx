import React, { useState } from "react";
import { Request } from "../services/models/Request";
import {
  IRequestFilters,
  RequestFilters,
  useRequestFiltering
} from "../components/filters/RequestFilters";
import { Observable } from "rxjs/internal/Observable";

export type RequestContextType = {
  requests: Request[];
  updateRequests: (requests: Request[]) => void;
  subscribeTo: (observable: Observable<Request[]>) => void;
  filteredRequests: Request[];
  loading: boolean;
  filters: IRequestFilters;
  pageFilters: IRequestFilters;
  updatePageFilters: (filters: IRequestFilters) => void;
  applyFilters: (filters: IRequestFilters, update: boolean) => Request[];
};

export const RequestContext = React.createContext<RequestContextType>({
  requests: [],
  updateRequests: (requests: Request[]) => null,
  subscribeTo: (observable: Observable<Request[]>) => null,
  filteredRequests: [],
  loading: true,
  filters: new RequestFilters(),
  pageFilters: new RequestFilters(),
  updatePageFilters: (filters: IRequestFilters) => null,
  applyFilters: (filters: IRequestFilters, update: boolean) => []
});

export const RequestProvider: React.FC = (props: any) => {
  const [requests, updateRequests] = useState<Request[]>([]);
  const [filteredRequests, updateFilteredRequests] = useState<Request[]>(
    requests
  );
  const [loading, updateLoading] = useState<boolean>(false);
  const [filters, updateFilters] = useState<IRequestFilters>(
    new RequestFilters()
  );

  //the clear filters button goes back to filters that are set by the page
  const [pageFilters, updatePageFilters] = useState<IRequestFilters>(
    new RequestFilters()
  );

  const { applyFilters } = useRequestFiltering();

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

  const applyRequestFilters = (
    filters: IRequestFilters,
    update: boolean = true
  ) => {
    let filteredRequests: Request[] = applyFilters(filters, requests);
    if (update) {
      updateFilteredRequests(filteredRequests);
      updateFilters(filters);
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
        pageFilters: pageFilters,
        updatePageFilters: updatePageFilters,
        applyFilters: applyRequestFilters
      }}
    >
      {props.children}
    </RequestContext.Provider>
  );
};

export default RequestContext;
