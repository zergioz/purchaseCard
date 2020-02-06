import React, { useEffect, useContext, useState } from "react";
import RequestContext from "../../../contexts/RequestContext";
import { RequestService } from "../../../services";
import { LoadingResults } from "../../../components/request-table/LoadingResults";
import { Alert, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { RequestForm } from "../../../components/request-form/RequestForm";
import { Request } from "../../../services/models/Request";
import { of } from "rxjs";
import { PDFViewer } from "@react-pdf/renderer";
import { RequestPdf } from "../../../components/request-pdf/RequestPdf";
interface IProps {
  requestId: number;
}
export const RequestPrintView = (props: IProps) => {
  const svc = new RequestService();
  const context = useContext(RequestContext);
  const [request, setRequest] = useState();
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
      }
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
      {!context.loading && request && (
        <>
          <PDFViewer width="100%" height="900">
            <RequestPdf request={request} />
          </PDFViewer>
          {/* <RequestForm
            request={request}
            editing={false}
            onRequestUpdated={(newRequest: Request) => of(newRequest)}
            setEditing={() => {}}
          /> */}
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
