import React, { useState, useEffect, useContext } from "react";
import { Request } from "../../services/models/Request";
import { Form, Row, Col, ButtonToolbar, Button, Table } from "react-bootstrap";
import { FundingSources } from "../../constants/FundingSources";
import { PersonDirectorates as directorates } from "../../constants/PersonDirectorates";
import { AttachmentTypes as attachmentTypes } from "../../constants/AttachmentTypes";
import { CardTypes as cardTypes } from "../../constants/CardTypes";
import { Currencies as currencies } from "../../constants/Currencies";
import { FiscalYears as fiscalYears } from "../../constants/FiscalYears";
import { FiscalQuarters as fiscalQuarters } from "../../constants/FiscalQuarters";
import { FaTimes, FaPlus } from "react-icons/fa";
import { Detail } from "../../services/models/PurchaseDetails";
import { Formik } from "formik";
import ReactDatePicker, {
  DatePickerProps
} from "react-date-picker/dist/entry.nostyle";
import "./DatePicker.css";
import { parseISO, format } from "date-fns";

interface IProps {
  request: Request;
  onRequestUpdated: (newRequest: Request) => void;
  editing?: boolean;
}
export const RequestForm = (props: IProps) => {
  const [request, setRequest] = useState<Request>(props.request);
  const [attachments, setAttachments] = useState<any>([]);
  const [editing, setEditing] = useState<boolean>(props.editing === true);

  const onSaveClicked = () => {
    setEditing(false);
    props.onRequestUpdated(request);
  };

  const onEditClicked = () => {
    setEditing(true);
  };

  useEffect(() => {
    setRequest(props.request);
  }, [props.request]);

  const onSubmit = () => {};

  const DatePicker = (props: DatePickerProps) => {
    return <ReactDatePicker {...props} />;
  };

  return (
    <>
      <Formik initialValues={request} onSubmit={onSubmit}>
        {request && (
          <Form>
            <Form.Group className="bg-secondary p-3">
              <Row>
                <Col>
                  <h2 className="text-white">
                    GPC Request{" "}
                    <span className="h1 font-weight-lighter text-light">
                      #{request.id}
                    </span>
                  </h2>
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
                    <Form.Control
                      type="text"
                      disabled
                      readOnly
                      value={request.author.Title}
                    />
                  </Form.Group>
                  <Form.Group controlId="formGridState">
                    <Form.Label>Card Type</Form.Label>
                    <Form.Control
                      as="select"
                      disabled={!editing}
                      name="requestField.RequestCardType"
                      value={request.requestField.RequestCardType}
                    >
                      {cardTypes.map((type: string) => {
                        return (
                          <option value={type} key={type}>
                            {type}
                          </option>
                        );
                      })}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="formGroupEmail">
                    <Form.Label>Cardholder</Form.Label>
                    <Form.Control
                      type="text"
                      disabled={!editing}
                      name="requestField.RequestorCardHolderName"
                      value={request.requestField.RequestorCardHolderName}
                    />
                  </Form.Group>
                  <Form.Group controlId="formGroupEmail">
                    <Form.Label>Request Date</Form.Label>
                    <Form.Control
                      type="text"
                      value={format(
                        parseISO(request.created),
                        "MM/dd/yyyy"
                      ).toUpperCase()}
                      name="created"
                      readOnly
                      disabled
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formGroupEmail">
                    <Form.Label>Requestor DSN</Form.Label>
                    <Form.Control
                      type="text"
                      disabled={!editing}
                      name="requestField.RequestorDSN"
                      placeholder="Enter a phone number"
                      value={request.requestField.RequestorDSN}
                    />
                  </Form.Group>
                  <Form.Group controlId="formGridState">
                    <Form.Label>Directorate</Form.Label>
                    <Form.Control
                      as="select"
                      disabled={!editing}
                      name="requestField.RequestorDirectorate"
                      value={request.requestField.RequestorDirectorate}
                    >
                      {directorates.map((directorate: string) => {
                        return (
                          <option value={directorate} key={directorate}>
                            {directorate}
                          </option>
                        );
                      })}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="formGridState">
                    <Form.Label>Funding</Form.Label>
                    <Form.Control
                      as="select"
                      disabled={!editing}
                      name="requestField.RequestSource"
                      value={request.requestField.RequestSource}
                    >
                      {FundingSources.map(src => {
                        return (
                          <option value={src} key={src}>
                            {src}
                          </option>
                        );
                      })}
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="ControlTextarea1">
                    <Form.Label>Justification</Form.Label>
                    <Form.Control
                      as="textarea"
                      disabled={!editing}
                      rows={4}
                      name="requestField.RequestJustification"
                      value={request.requestField.RequestJustification}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="formGridState">
                    <Form.Label>
                      Includes hardware, software, or IT services
                    </Form.Label>
                    <Form.Control
                      as="select"
                      disabled={!editing}
                      name="requestField.RequestIsJ6"
                      value={request.requestField.RequestIsJ6}
                    >
                      <option value={"Yes"}>Yes</option>
                      <option value={"No"}>No</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formGridState">
                    <Form.Label>Currency</Form.Label>
                    <Form.Control
                      as="select"
                      disabled={!editing}
                      name="requestField.RequestCurrencyType"
                      value={request.requestField.RequestCurrencyType}
                    >
                      {currencies.map((currency: string) => {
                        return (
                          <option value={currency} key={currency}>
                            {currency}
                          </option>
                        );
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
                    <Form.Control
                      type="text"
                      disabled={!editing}
                      placeholder="Enter Transaction ID"
                      name="requestField.transactionId"
                      value={request.requestField.transactionId}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formGroupEmail">
                    <Form.Label>Execution Date</Form.Label>
                    <Form.Control
                      as={DatePicker}
                      disabled={!editing}
                      name="requestField.executionDate"
                      className={!editing ? "date-picker-locked" : ""}
                      value={request.requestField.executionDate}
                    />
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
                    <Form.Control
                      as="select"
                      disabled={!editing}
                      name="requestField.fiscalYear"
                      value={request.requestField.fiscalYear}
                    >
                      {fiscalYears.map((year: any) => {
                        return (
                          <option value={year} key={year}>
                            {year}
                          </option>
                        );
                      })}
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formGroupEmail">
                    <Form.Label>Quarter</Form.Label>
                    <Form.Control
                      as="select"
                      disabled={!editing}
                      name="requestField.fiscalQuarter"
                      value={request.requestField.fiscalQuarter}
                    >
                      {fiscalQuarters.map((quarter: string) => {
                        return (
                          <option value={quarter} key={quarter}>
                            {quarter}
                          </option>
                        );
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
                      {request &&
                        request.purchaseDetails &&
                        request.purchaseDetails.Details &&
                        request.purchaseDetails.Details.map(
                          (item: Detail, index: number) => {
                            return (
                              <tr key={index}>
                                <td>{item.requestQty}</td>
                                <td>{item.requestDesc}</td>
                                <td>{item.requestSrc}</td>
                                <td>{item.requestCost}</td>
                                <td>{item.requestCost}</td>
                                <td>
                                  <Form.Group controlId="formBasicCheckbox">
                                    <Form.Check type="checkbox" disabled />
                                  </Form.Group>
                                </td>
                                <td>
                                  <Form.Group controlId="formBasicCheckbox">
                                    <Form.Check type="checkbox" disabled />
                                  </Form.Group>
                                </td>
                                <td>{item.requestTotal}</td>
                                <td>
                                  <span className="text-danger">
                                    <FaTimes
                                      style={{
                                        cursor: "pointer",
                                        display: editing ? "inherit" : "none"
                                      }}
                                    />
                                  </span>
                                </td>
                              </tr>
                            );
                          }
                        )}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={9} align="right">
                          <Button variant="outline-primary" disabled={!editing}>
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
                                        <option value={type} key={type}>
                                          {type}
                                        </option>
                                      );
                                    })}
                                  </Form.Control>
                                </Form.Group>
                              </td>
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
                        <td colSpan={3} align="right">
                          <Button variant="outline-primary" disabled={!editing}>
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
        )}
      </Formik>
    </>
  );
};
