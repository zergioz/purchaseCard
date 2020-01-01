import React, { useState } from "react";
import { RequestService } from "../services/RequestService";
import { Request } from "../services/models/Request";

const svc = new RequestService();

export type RequestContextType = {
  requests: Request[];
  loading: boolean;
  refreshRequests: () => void;
};

export const RequestContext = React.createContext<RequestContextType>({
  requests: [],
  loading: true,
  refreshRequests: () => {}
});

export const RequestProvider: React.FC = (props: any) => {
  const [requests, updateRequests] = useState<Request[]>([]);
  const [loading, updateLoading] = useState(true);

  const refreshRequests = () => {
    updateLoading(true);
    svc.read().subscribe((items: Request[]) => {
      updateRequests(items);
      updateLoading(false);
    });
  };

  return (
    <RequestContext.Provider
      value={{
        requests: requests,
        loading: loading,
        refreshRequests: refreshRequests
      }}
    >
      {props.children}
    </RequestContext.Provider>
  );
};

export default RequestContext;
