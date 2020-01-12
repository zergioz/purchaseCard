import React, { useEffect, useContext, useState } from "react";
import RequestContext from "../../../contexts/RequestContext";
import { Request } from "../../../services/models/Request";
import { RequestService } from "../../../services";
import { LoadingResults } from "../../../components/request-table/LoadingResults";
import { Alert, Button } from "react-bootstrap";
import { ApprovalProgressBar } from "../../../components/approval-progress-bar/ApprovalProgressBar";
import { RequestForm } from "../../../components/request-form/RequestForm";
import UserContext from "../../../contexts/UserContext";

export const NewRequest = () => {
  const context = useContext(RequestContext);
  const { user } = useContext(UserContext);
  const [request, setRequest] = useState();

  //start the db call to create a new draft
  useEffect(() => {
    const svc = new RequestService();
    const obs = svc.createDraft();
    context.subscribeTo(obs, "create", true);
    obs.subscribe(request => {
      setRequest(request);
    });
  }, []);

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
                <RequestForm request={request} editing={true} />
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
