import React, { useEffect, useContext, useState } from "react";
import RequestContext from "../../../contexts/RequestContext";
import { RequestService } from "../../../services";
import { LoadingResults } from "../../../components/request-table/LoadingResults";
import { Alert, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { useToasts } from "react-toast-notifications";

//this page just shows a spinner
//it makes a call to create a new request, updates the context with it, then redirects to the edit form
export const NewRequest = () => {
  const context = useContext(RequestContext);
  const [request, setRequest] = useState();
  const history = useHistory();
  const svc = new RequestService();
  const { addToast } = useToasts();

  //on page load, start the db call to create a new draft
  useEffect(() => {
    const obs = svc.createDraft();
    context.subscribeTo(obs, "create");
    obs.subscribe(newRequest => {
      setRequest(request);
      history.push(`/requests/details/${newRequest.id}`);
      addToast(`Created Draft #${newRequest.id}`, {
        appearance: "success",
        autoDismiss: true
      });
    });
  }, []);

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-12 mb-4 text-center"></div>
        </div>
      </div>
      {context.loading && <LoadingResults />}
      {!context.loading && !request && (
        <div className="row">
          <div className="col-12">
            <Alert variant="danger">
              <Alert.Heading>Error</Alert.Heading>
              <hr />
              There was an error creating the request.{" "}
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
