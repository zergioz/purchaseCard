import React, { useEffect, useContext, useState } from "react";
import RequestContext from "../../../contexts/RequestContext";
import { Request } from "../../../services/models/Request";
import { RequestService } from "../../../services";
import { LoadingResults } from "../../../components/request-table/LoadingResults";
import { Alert, Button } from "react-bootstrap";
import { ApprovalProgressBar } from "../../../components/approval-progress-bar/ApprovalProgressBar";
import { RequestForm } from "../../../components/request-form/RequestForm";
import { useToasts } from "react-toast-notifications";
import { useHistory } from "react-router-dom";
import { Observable } from "rxjs";
import Media from "react-media";
import "./RequestDetails.css";

interface IProps {
  requestId: number;
}
export const RequestDetails = (props: IProps) => {
  const { addToast } = useToasts();
  const svc = new RequestService();
  const context = useContext(RequestContext);
  const [request, setRequest] = useState();
  const [editing, setEditing] = useState<boolean>(false);
  const history = useHistory();

  //get item from db on page load
  useEffect(() => {
    if (!props.requestId) {
      history.push("/requests");
      return;
    }
    const obs = svc.read(`Id eq ${props.requestId}`);
    context.subscribeTo(obs, "read");
    obs.subscribe(requests => {
      const request = requests[0];
      if (request) {
        setRequest(request);
        if (request.status === "Draft") {
          setEditing(true);
        }
      }
    });
  }, []);

  const onRequestUpdated = (newRequest: Request): Observable<Request> => {
    addToast(`Saving...`, {
      appearance: "info",
      autoDismiss: true
    });
    let obs = svc.update(newRequest);
    obs.subscribe(
      () => {
        setRequest(newRequest);
        context.updateRequest(newRequest);
        addToast("Saved", { appearance: "success", autoDismiss: true });
      },
      error => {
        console.error(`Error updating request.`, error);
        addToast(`Error while saving!`, {
          appearance: "error",
          autoDismiss: false
        });
      },
      () => {}
    );
    return obs;
  };

  return (
    <Media
      queries={{
        small: "(max-width: 599px)",
        medium: "(min-width: 600px) and (max-width: 1199px)",
        large: "(min-width: 1200px)",
        print: "(orientation: portrait)"
      }}
    >
      {(matches: any) => (
        <>
          <div className="container">
            <div className="row">
              <div className="col-12 mb-4 text-center"></div>
            </div>
          </div>
          {context.loading && <LoadingResults />}
          {!context.loading && request && (
            <>
              {!matches.print && matches.large && (
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-12 mb-4 text-center">
                      <ApprovalProgressBar request={request} locked={editing} />
                      <hr />
                    </div>
                  </div>
                </div>
              )}
              <div
                className={`section-to-print ${
                  matches.print || !matches.large
                    ? "container-fluid"
                    : "container"
                }`}
              >
                <div className="row">
                  <div className="col-12 m-2">
                    <RequestForm
                      onRequestUpdated={onRequestUpdated}
                      request={request}
                      editing={editing}
                      setEditing={setEditing}
                    />
                  </div>
                </div>
              </div>
              {/* <div className="container">
            <div className="row">
              <div className="col-12">
                <pre style={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}>
                  {JSON.stringify(request, null, 2)}
                </pre>
              </div>
            </div>
          </div> */}
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
      )}
    </Media>
  );
};
