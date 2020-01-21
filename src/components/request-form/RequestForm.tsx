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
import { useFormik } from "formik";
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

  const formik = useFormik({
    initialValues: {
      requestField: request.requestField
    },
    onSubmit: values => {
      console.log(values);
    }
  });

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

  const DatePicker = (props: DatePickerProps) => {
    return <ReactDatePicker {...props} />;
  };

  return (
    <>
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
          <Form.Group className="bg-light p-3">
            <legend>Request Details</legend>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Requestor</Form.Label>
                  <Form.Control
                    type="text"
                    disabled
                    readOnly
                    value={request.author.Title}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Card Type</Form.Label>
                  <Form.Control
                    as="select"
                    disabled={!editing}
                    name="requestField.RequestCardType"
                    id="requestField.RequestCardType"
                    value={formik.values.requestField.RequestCardType}
                    onChange={formik.handleChange}
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
                <Form.Group>
                  <Form.Label>Cardholder</Form.Label>
                  <Form.Control
                    type="text"
                    disabled={!editing}
                    name="requestField.RequestorCardHolderName"
                    id="requestField.RequestorCardHolderName"
                    value={formik.values.requestField.RequestorCardHolderName}
                    onChange={formik.handleChange}
                  />
                </Form.Group>
                <Form.Group>
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
                <Form.Group>
                  <Form.Label>Requestor DSN</Form.Label>
                  <Form.Control
                    type="text"
                    disabled={!editing}
                    name="requestField.RequestorDSN"
                    id="requestField.RequestorDSN"
                    placeholder="Enter a phone number"
                    value={formik.values.requestField.RequestorDSN}
                    onChange={formik.handleChange}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Directorate</Form.Label>
                  <Form.Control
                    as="select"
                    disabled={!editing}
                    name="requestField.RequestorDirectorate"
                    id="requestField.RequestorDirectorate"
                    value={formik.values.requestField.RequestorDirectorate}
                    onChange={formik.handleChange}
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
                <Form.Group>
                  <Form.Label>Funding</Form.Label>
                  <Form.Control
                    as="select"
                    disabled={!editing}
                    name="requestField.RequestSource"
                    id="requestField.RequestSource"
                    value={formik.values.requestField.RequestSource}
                    onChange={formik.handleChange}
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
                <Form.Group>
                  <Form.Label>Justification</Form.Label>
                  <Form.Control
                    as="textarea"
                    disabled={!editing}
                    rows={4}
                    name="requestField.RequestJustification"
                    id="requestField.RequestJustification"
                    value={formik.values.requestField.RequestJustification}
                    onChange={formik.handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>
                    Includes hardware, software, or IT services
                  </Form.Label>
                  <Form.Control
                    as="select"
                    disabled={!editing}
                    name="requestField.RequestIsJ6"
                    id="requestField.RequestIsJ6"
                    value={formik.values.requestField.RequestIsJ6}
                    onChange={formik.handleChange}
                  >
                    <option value={"Yes"}>Yes</option>
                    <option value={"No"}>No</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Currency</Form.Label>
                  <Form.Control
                    as="select"
                    disabled={!editing}
                    name="requestField.RequestCurrencyType"
                    id="requestField.RequestCurrencyType"
                    value={formik.values.requestField.RequestCurrencyType}
                    onChange={formik.handleChange}
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
          <Form.Group className="bg-light p-3">
            <legend>Execution Info</legend>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Transaction ID</Form.Label>
                  <Form.Control
                    type="text"
                    disabled={!editing}
                    placeholder="Enter Transaction ID"
                    name="requestField.transactionId"
                    id="requestField.transactionId"
                    value={formik.values.requestField.transactionId}
                    onChange={formik.handleChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Execution Date</Form.Label>
                  <Form.Control
                    as={DatePicker}
                    disabled={!editing}
                    name="requestField.executionDate"
                    id="requestField.executionDate"
                    className={!editing ? "date-picker-locked" : ""}
                    value={formik.values.requestField.executionDate}
                    onChange={formik.handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form.Group>
          <Form.Group className="bg-light p-3">
            <legend>J8 Data</legend>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Fiscal Year</Form.Label>
                  <Form.Control
                    as="select"
                    disabled={!editing}
                    name="requestField.fiscalYear"
                    id="requestField.fiscalYear"
                    value={formik.values.requestField.fiscalYear}
                    onChange={formik.handleChange}
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
                <Form.Group>
                  <Form.Label>Quarter</Form.Label>
                  <Form.Control
                    as="select"
                    disabled={!editing}
                    name="requestField.fiscalQuarter"
                    id="requestField.fiscalQuarter"
                    value={formik.values.requestField.fiscalQuarter}
                    onChange={formik.handleChange}
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
                                <Form.Group>
                                  <Form.Check type="checkbox" disabled />
                                </Form.Group>
                              </td>
                              <td>
                                <Form.Group>
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
                              <Form.Group>
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
    </>
  );
};
