import React, { useEffect, useContext, useState } from "react";
import RequestContext from "../../../contexts/RequestContext";
import { Request } from "../../../services/models/Request";
import { RequestFilters } from "../../../components/filters/RequestFilters";
import { RequestService } from "../../../services";
import { LoadingResults } from "../../../components/request-table/LoadingResults";
import {
  Alert,
  Button,
  Form,
  Row,
  Col,
  Table,
  ButtonToolbar
} from "react-bootstrap";
import { FaTimes, FaPlus } from "react-icons/fa";
import { Detail } from "../../../services/models/PurchaseDetails";
import { ApprovalProgressBar } from "../../../components/approval-progress-bar/ApprovalProgressBar";
import { PersonDirectorates as directorates } from "../../../constants/PersonDirectorates";
import { FundingSources } from "../../../constants/FundingSources";
import { AttachmentTypes as attachmentTypes } from "../../../constants/AttachmentTypes";
import { CardTypes as cardTypes } from "../../../constants/CardTypes";
import { Currencies as currencies } from "../../../constants/Currencies";
import { FiscalYears as fiscalYears } from "../../../constants/FiscalYears";
import { FiscalQuarters as fiscalQuarters } from "../../../constants/FiscalQuarters";
import { convertApprovalsToHistory } from "../../../helpers/ApprovalsToHistory";

interface IProps {
  requestId: number;
}
export const RequestDetails = (props: IProps) => {
  const context = useContext(RequestContext);
  const [request, setRequest] = useState();
  const [details, setDetails] = useState<Detail[]>([]);
  const [attachments, setAttachments] = useState<any>([]);
  const [editing, setEditing] = useState<boolean>(false);
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

  //update the purchase details when the request changes
  //? get rid of this?
  useEffect(() => {
    const requestDetails =
      request && request.purchaseDetails ? request.purchaseDetails.Details : [];
    setDetails(requestDetails || []);
  }, [request]);

  const onSaveClicked = () => {
    setEditing(false);
  };
  const onEditClicked = () => {
    setEditing(true);
  };

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
                <Form>
                  <Form.Group className="bg-secondary p-3">
                    <Row>
                      <Col>
                        <h2 className="text-light">GPC Request Form</h2>
                      </Col>
                      <Col className="d-flex justify-content-end">
                        <ButtonToolbar className="text-right">
                          <Button
                            variant="outline-light"
                            hidden={editing}
                            onClick={() => onEditClicked()}
                          >
                            Edit this request
                          </Button>
                          <Button
                            variant="primary"
                            hidden={!editing}
                            onClick={() => onSaveClicked()}
                          >
                            Save Changes
                          </Button>
                        </ButtonToolbar>
                      </Col>
                    </Row>
                  </Form.Group>
                  <Form.Group controlId="details" className="bg-light p-3">
                    <legend>Request Details</legend>
                    <Row>
                      <Col>
                        <Form.Group controlId="formGroupEmail">
                          <Form.Label>Requestor</Form.Label>
                          <Form.Control type="text" placeholder="Enter email" />
                        </Form.Group>
                        <Form.Group controlId="formGridState">
                          <Form.Label>Card Type</Form.Label>
                          <Form.Control as="select">
                            {cardTypes.map(type => {
                              return <option key={type}>{type}</option>;
                            })}
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
                            {currencies.map(currency => {
                              return <option key={currency}>{currency}</option>;
                            })}
                          </Form.Control>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Form.Group>
                  <Form.Group controlId="details" className="bg-light p-3">
                    <legend>Execution Info</legend>
                    <Row>
                      <Col>
                        <Form.Group controlId="formGroupEmail">
                          <Form.Label>Transaction ID</Form.Label>
                          <Form.Control type="text" placeholder="Enter email" />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group controlId="formGroupEmail">
                          <Form.Label>Execution Date</Form.Label>
                          <Form.Control type="text" placeholder="Enter email" />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Form.Group>
                  <Form.Group controlId="details" className="bg-light p-3">
                    <legend>J8 Data</legend>
                    <Row>
                      <Col>
                        <Form.Group controlId="formGroupEmail">
                          <Form.Label>Fiscal Year</Form.Label>
                          <Form.Control as="select">
                            {fiscalYears.map(year => {
                              return <option key={year}>{year}</option>;
                            })}
                          </Form.Control>
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group controlId="formGroupEmail">
                          <Form.Label>Quarter</Form.Label>
                          <Form.Control as="select">
                            {fiscalQuarters.map(quarter => {
                              return <option key={quarter}>{quarter}</option>;
                            })}
                          </Form.Control>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Form.Group>
                  <Form.Group className="p-3 bg-light">
                    <legend>Line Items</legend>
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
                              details.map((item, index) => {
                                return (
                                  <tr key={index}>
                                    <td>{item.requestQty}</td>
                                    <td>{item.requestDesc}</td>
                                    <td>{item.requestSrc}</td>
                                    <td>{item.requestCost}</td>
                                    <td>{item.requestCost}</td>
                                    <td>
                                      <Form.Group controlId="formBasicCheckbox">
                                        <Form.Check type="checkbox" />
                                      </Form.Group>
                                    </td>
                                    <td>
                                      <Form.Group controlId="formBasicCheckbox">
                                        <Form.Check type="checkbox" />
                                      </Form.Group>
                                    </td>
                                    <td>{item.requestTotal}</td>
                                    <td>
                                      <span className="text-danger">
                                        <FaTimes
                                          style={{ cursor: "pointer" }}
                                        />
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                          <tfoot>
                            <tr>
                              <td colSpan={9} align="right">
                                <Button variant="outline-primary">
                                  <FaPlus /> Add
                                </Button>
                              </td>
                            </tr>
                          </tfoot>
                        </Table>
                      </Col>
                    </Row>
                  </Form.Group>
                  <Form.Group className="bg-light p-3">
                    <legend>Attachments</legend>
                    <Row>
                      <Col>
                        <Table>
                          <thead>
                            <tr>
                              <th>File name</th>
                              <th>Type</th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            {attachments &&
                              attachments.map((attachment: any) => {
                                return (
                                  <tr>
                                    <td>{attachment.name}</td>
                                    <td>
                                      <Form.Group controlId="formGridState">
                                        <Form.Control as="select">
                                          {attachmentTypes.map(type => {
                                            return (
                                              <option key={type}>{type}</option>
                                            );
                                          })}
                                        </Form.Control>
                                      </Form.Group>
                                    </td>
                                    <td>
                                      <span className="text-danger">
                                        <FaTimes
                                          style={{ cursor: "pointer" }}
                                        />
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                          <tfoot>
                            <tr>
                              <td colSpan={3} align="right">
                                <Button variant="outline-primary">
                                  Upload
                                </Button>
                              </td>
                            </tr>
                          </tfoot>
                        </Table>
                      </Col>
                    </Row>
                  </Form.Group>
                  <Form.Group className="bg-secondary p-3">
                    <Row>
                      <Col className="d-flex justify-content-end">
                        <ButtonToolbar className="text-right">
                          <Button
                            variant="outline-light"
                            hidden={editing}
                            onClick={() => onEditClicked()}
                          >
                            Edit this request
                          </Button>
                          <Button
                            variant="primary"
                            hidden={!editing}
                            onClick={() => onSaveClicked()}
                          >
                            Save Changes
                          </Button>
                        </ButtonToolbar>
                      </Col>
                    </Row>
                  </Form.Group>
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
                  {JSON.stringify(
                    convertApprovalsToHistory(request.approvals),
                    null,
                    2
                  )}
                </pre>
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
