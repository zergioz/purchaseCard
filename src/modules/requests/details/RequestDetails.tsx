import React, { useEffect, useContext, useState } from "react";
import RequestContext from "../../../contexts/RequestContext";
import { Request } from "../../../services/models/Request";
import { RequestFilters } from "../../../components/filters/RequestFilters";
import { RequestService } from "../../../services";
import { LoadingResults } from "../../../components/request-table/LoadingResults";
import { Alert, Button, Form, Row, Col, Table } from "react-bootstrap";
import { FaTimes, FaPlus } from "react-icons/fa";
import { Detail } from "../../../services/models/PurchaseDetails";
import { ApprovalProgressBar } from "./ApprovalProgressBar";
import { PersonDirectorates as directorates } from "../../../constants/PersonDirectorates";
import { FundingSources } from "../../../constants/FundingSources";

interface IProps {
  requestId: number;
}
export const RequestDetails = (props: IProps) => {
  const context = useContext(RequestContext);
  const [request, setRequest] = useState<Request | undefined>(undefined);
  const [details, setDetails] = useState<Detail[]>([]);
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
    const requestDetails =
      request && request.purchaseDetails ? request.purchaseDetails.Details : [];
    setRequest(request);
    setDetails(requestDetails || []);
  }, [context.requests]);

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-12 mb-4 text-center">
            <h2>Request Details</h2>
          </div>
        </div>
      </div>
      {context.loading && <LoadingResults />}
      {!context.loading && request && (
        <>
          <div className="container-fluid">
            <div className="row">
              <div className="col-12 mb-4 text-center">
                <ApprovalProgressBar status={request.status || ""} />
                <hr />
              </div>
            </div>
          </div>
          <div className="container">
            <div className="row">
              <div className="col-12">
                <Form>
                  <Row>
                    <Col>
                      <Form.Group controlId="formGroupEmail">
                        <Form.Label>Requestor</Form.Label>
                        <Form.Control type="text" placeholder="Enter email" />
                      </Form.Group>
                      <Form.Group controlId="formGridState">
                        <Form.Label>Card Type</Form.Label>
                        <Form.Control as="select">
                          <option value="ORF">ORF Card</option>
                          <option value="Standard">Standard Card</option>
                          <option value="Training">Training Card</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group controlId="formGroupEmail">
                        <Form.Label>Cardholder</Form.Label>
                        <Form.Control type="text" placeholder="Enter email" />
                      </Form.Group>
                      <Form.Group controlId="formGroupEmail">
                        <Form.Label>Request Date</Form.Label>
                        <Form.Control type="text" placeholder="Enter email" />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group controlId="formGroupEmail">
                        <Form.Label>Requestor DSN</Form.Label>
                        <Form.Control type="text" placeholder="Enter email" />
                      </Form.Group>
                      <Form.Group controlId="formGridState">
                        <Form.Label>Directorate</Form.Label>
                        <Form.Control as="select">
                          {directorates.map(directorate => {
                            return (
                              <option key={directorate}>{directorate}</option>
                            );
                          })}
                        </Form.Control>
                      </Form.Group>
                      <Form.Group controlId="formGridState">
                        <Form.Label>Funding</Form.Label>
                        <Form.Control as="select">
                          {FundingSources.map(src => {
                            return <option key={src}>{src}</option>;
                          })}
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Group controlId="ControlTextarea1">
                        <Form.Label>Justification</Form.Label>
                        <Form.Control as="textarea" rows={4} />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Group controlId="formGridState">
                        <Form.Label>
                          Includes hardware, software, or IT services
                        </Form.Label>
                        <Form.Control as="select">
                          <option>Yes</option>
                          <option>No</option>
                        </Form.Control>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group controlId="formGridState">
                        <Form.Label>Currency</Form.Label>
                        <Form.Control as="select">
                          <option>USD</option>
                          <option>EUR</option>
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Table>
                        <thead>
                          <tr>
                            <th>Quantity</th>
                            <th>Description</th>
                            <th>Vendor</th>
                            <th>Unit Cost</th>
                            <th>Rate</th>
                            <th>DD-250</th>
                            <th>DA-2062</th>
                            <th>Total</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {details &&
                            details.map(item => {
                              return (
                                <tr>
                                  <td>{item.requestQty}</td>
                                  <td>{item.requestDesc}</td>
                                  <td>{item.requestSrc}</td>
                                  <td>{item.requestCost}</td>
                                  <td>{item.requestCost}</td>
                                  <td>{item.requestDdForm}</td>
                                  <td>{item.requestDaForm}</td>
                                  <td>{item.requestTotal}</td>
                                  <td>
                                    <span className="text-danger">
                                      <FaTimes style={{ cursor: "pointer" }} />
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colSpan={8} align="right">
                              <Button variant="outline-primary">
                                <FaPlus /> Add
                              </Button>
                            </td>
                          </tr>
                        </tfoot>
                      </Table>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Button variant="primary" type="submit">
                        Submit
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <pre style={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}>
                  {" "}
                </pre>
              </div>
            </div>
            <hr />
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
