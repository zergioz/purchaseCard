import React, { useEffect, useContext, useState } from "react";
import RequestContext from "../../../contexts/RequestContext";
import { Request } from "../../../services/models/Request";
import { RequestFilters } from "../../../components/filters/RequestFilters";
import { RequestService } from "../../../services";
import { LoadingResults } from "../../../components/request-table/LoadingResults";
import { Alert, Button } from "react-bootstrap";
import { ApprovalProgressBar } from "../../../components/approval-progress-bar/ApprovalProgressBar";
import { RequestForm } from "../../../components/request-form/RequestForm";

interface IProps {
  requestId: number;
}
export const RequestDetails = (props: IProps) => {
  const context = useContext(RequestContext);
  const [request, setRequest] = useState();
  const defaultFilters = new RequestFilters();

  //start the db fetch
  useEffect(() => {
    const svc = new RequestService();
    context.subscribeTo(svc.read());
  }, []);

  //apply the ID filter when results come back
  useEffect(() => {
    defaultFilters.id = props.requestId;
    context.updatePageFilters(defaultFilters);
    context.applyFilters(defaultFilters, true);
  }, [context.requests]);

  //update our state when the filter is applied
  useEffect(() => {
    const request = context.filteredRequests[0];
    if (request) {
      setRequest(request);
    }
  }, [context.filteredRequests]);

  const onRequestUpdated = (oldRequest: Request, newRequest: Request) => {
    context.updateRequest(oldRequest, newRequest);
  };

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-12 mb-4 text-center"></div>
        </div>
      </div>
      {context.loading && <LoadingResults />}
      {!context.loading && request && (
        <>
          <div className="container-fluid">
            <div className="row">
              <div className="col-12 mb-4 text-center">
                <ApprovalProgressBar
                  request={request}
                  locked={false}
                  onRequestUpdated={onRequestUpdated}
                />
                <hr />
              </div>
            </div>
          </div>
          <div className="container">
            <div className="row">
              <div className="col-12 m-2">
                <RequestForm request={request} />
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <pre style={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}>
                  {JSON.stringify(request, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </>
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
    </>
  );
};
