import React, { useEffect, useContext, useState } from "react";
import RequestContext from "../../../contexts/RequestContext";
import { Request } from "../../../services/models/Request";
import { RequestFilters } from "../../../components/filters/RequestFilters";
import { RequestService } from "../../../services";
import { LoadingResults } from "../../../components/request-table/LoadingResults";
import { Alert, Button } from "react-bootstrap";

interface IProps {
  requestId: number;
}
export const RequestDetails = (props: IProps) => {
  const context = useContext(RequestContext);
  const [request, setRequest] = useState<Request | undefined>(undefined);

  const defaultFilters = new RequestFilters();

  useEffect(() => {
    const svc = new RequestService();
    context.subscribeTo(svc.read());
  }, []);

  useEffect(() => {
    context.updatePageFilters(defaultFilters);
    context.applyFilters(defaultFilters, true);
  }, [context.requests]);

  useEffect(() => {
    const request = context.requests.find(item => item.id == props.requestId);
    setRequest(request);
  }, [context.requests]);

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-12 mb-4 text-center">
            <h2>Request Details</h2>
          </div>
        </div>
        {context.loading && <LoadingResults />}
        {!context.loading && request && (
          <div className="row">
            <div className="col-12">
              <pre style={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}>
                {JSON.stringify(request, null, 2)}
              </pre>
            </div>
          </div>
        )}
        {!context.loading && !request && (
          <div className="row">
            <div className="col-12">
              <Alert variant="danger">
                <Alert.Heading>Error</Alert.Heading>
                <hr />
                There is no request data to display.{" "}
                <div className="d-flex justify-content-end">
                  <Button variant="outline-danger" href={`#/`}>
                    Go back
                  </Button>
                </div>
              </Alert>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
