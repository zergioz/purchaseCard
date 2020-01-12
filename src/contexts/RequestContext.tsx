import React, { useState } from "react";
import { Request } from "../services/models/Request";
import {
  IRequestFilters,
  RequestFilters,
  useRequestFiltering
} from "../components/filters/RequestFilters";
import { Observable } from "rxjs/internal/Observable";
import { FaBreadSlice } from "react-icons/fa";

//the filters could probably be refactored into their own context and placed at the top of each page
export type RequestContextType = {
  requests: Request[];
  updateRequests: (requests: Request[]) => void;
  subscribeTo: (
    observable: Observable<Request[] | Request>,
    action: "create" | "read" | "update" | "delete"
  ) => void;
  filteredRequests: Request[];
  loading: boolean;
  filters: IRequestFilters;
  pageFilters: IRequestFilters;
  updatePageFilters: (filters: IRequestFilters) => void;
  updateRequest: (oldRequest: Request, newRequest: Request) => void;
  applyFilters: (filters: IRequestFilters, update: boolean) => Request[];
};

export const RequestContext = React.createContext<RequestContextType>({
  requests: [],
  updateRequests: (requests: Request[]) => null,
  subscribeTo: (
    observable: Observable<Request[] | Request>,
    action: "create" | "read" | "update" | "delete"
  ) => null,
  filteredRequests: [],
  loading: true,
  filters: new RequestFilters(),
  pageFilters: new RequestFilters(),
  updatePageFilters: (filters: IRequestFilters) => null,
  updateRequest: (oldRequest: Request, newRequest: Request) => null,
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

  //subscribes to an observable and updates the requests in the context depending on
  //what type of action was taken
  const subscribeTo = (
    observable: Observable<Request[] | Request>,
    action: "create" | "read" | "update" | "delete"
  ) => {
    updateLoading(true);

    observable.subscribe(response => {
      let currentRequests = [...requests];
      let singleItem = !Array.isArray(response);
      switch (action) {
        case "create":
          if (singleItem) {
            //we just created a request, so add the new item to what we already have
            currentRequests.push(response as Request);
            updateRequests(currentRequests);
          } else {
            console.warn(
              "RequestContext.subscribeTo(): Tried to do a bulk create"
            );
          }
        case "read":
          if (singleItem) {
            console.warn(
              "RequestContext.subscribeTo(): Tried to read a single item from the DB"
            );
          } else {
            //replace the whole array
            updateRequests(response as Request[]);
          }
          break;
        case "update":
          //find the item and replace it with the updated one
          if (singleItem) {
            updateRequest(response as Request, response as Request);
          } else {
            console.warn(
              "RequestContext.subscribeTo(): Tried to do a bulk update"
            );
          }
        case "delete":
          //find the item and remove it
          if (singleItem) {
            const index = currentRequests.findIndex(
              r => r.id === (response as Request).id
            );
            if (index > -1) {
              currentRequests.splice(index, 1);
            }
            updateRequests(currentRequests);
          } else {
            console.warn(
              "RequestContext.subscribeTo(): Tried to do a bulk delete"
            );
          }
        default:
          break;
      }

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

  const updateRequest = (oldRequest: Request, newRequest: Request) => {
    let currentRequests = [...requests];
    const index = currentRequests.findIndex(r => r.id === oldRequest.id);
    if (index > -1) {
      console.log("Replacing", currentRequests[index], newRequest);
      //currentRequests.splice(index, 1, newRequest);
      currentRequests[index] = newRequest;
    }
    updateRequests(currentRequests);
    applyRequestFilters(filters, false);
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
        updateRequest: updateRequest,
        applyFilters: applyRequestFilters
      }}
    >
      {props.children}
    </RequestContext.Provider>
  );
};

export default RequestContext;
