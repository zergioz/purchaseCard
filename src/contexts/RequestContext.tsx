import React, { useState } from "react";
import { RequestService } from "../services/RequestService";
import { Request } from "../services/models/Request";

const svc = new RequestService();

export type RequestContextType = {
  requests: Request[];
  refreshRequests: () => void;
};

export const RequestContext = React.createContext<RequestContextType>({
  requests: [],
  refreshRequests: () => {}
});

export const RequestProvider: React.FC = (props: any) => {
  const [requests, updateRequests] = useState<Request[]>([]);

  const refreshRequests = () => {
    svc.read().subscribe((items: Request[]) => {
      updateRequests(items);
    });
  };

  return (
    <RequestContext.Provider
      value={{
        requests: requests,
        refreshRequests: refreshRequests
      }}
    >
      {props.children}
    </RequestContext.Provider>
  );
};

export default RequestContext;
