import React, { useEffect, useContext, useState } from "react";
import RequestContext from "../../../contexts/RequestContext";
import { RequestService } from "../../../services";
import { LoadingResults } from "../../../components/request-table/LoadingResults";
import { Alert, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { PDFViewer } from "@react-pdf/renderer";
import { RequestPdf } from "../../../components/request-pdf/RequestPdf";
import { Attachment } from "../../../services/models/SharepointAttachments";
interface IProps {
  requestId: number;
}
export const RequestPrintView = (props: IProps) => {
  const svc = new RequestService();
  const context = useContext(RequestContext);
  const [loading, setLoading] = useState<boolean>(true);
  const [request, setRequest] = useState();
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const history = useHistory();

  // Internet Explorer 6-11
  //@ts-ignore
  const isInternetExplorer = /*@cc_on!@*/ false || !!document.documentMode;

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
        svc.getAttachments(request).subscribe((response: Attachment[]) => {
          setAttachments(response);
          setLoading(false);
        });
      }
    });
  }, []);

  return (
    <>
      {context.loading ||
        (loading && (
          <div className="container">
            <div className="row">
              <div className="col-12 mb-4 text-center"></div>
              <LoadingResults />
            </div>
          </div>
        ))}
      {!context.loading && !loading && request && attachments && (
        <>
          {!isInternetExplorer && (
            <PDFViewer width="100%" height="900">
              <RequestPdf request={request} attachments={attachments} />
            </PDFViewer>
          )}
          {isInternetExplorer && (
            <div className="container">
              <div className="row">
                <div className="col-12 mb-4 text-center"></div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <Alert variant="info" className="mt-5">
                    <Alert.Heading>Incompatible Browser</Alert.Heading>
                    <p>
                      The PDF viewer does not work in Internet Explorer. Please
                      switch to Edge, Chrome, or Firefox to view this document.
                    </p>
                    <hr />
                    <Button
                      variant="info"
                      href={`microsoft-edge:${window.location}`}
                    >
                      Open with Microsoft Edge
                    </Button>
                  </Alert>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      {!context.loading && !loading && !request && (
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
