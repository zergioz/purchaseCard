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
      ...request.requestField
    },
    onSubmit: values => {
      console.log(values);
    },
    validationSchema: new Request().getValidationSchema()
  });

  const onSaveClicked = () => {
    setEditing(false);
    const updatedRequest = new Request({
      ...request,
      requestField: formik.values
    });
    setRequest(updatedRequest);
    props.onRequestUpdated(updatedRequest);
  };

  const onEditClicked = () => {
    setEditing(true);
  };

  useEffect(() => {
    setRequest(props.request);
  }, [props.request]);

  //make formik work with custom react date picker
  //todo: remove hardcoded executionDate field name
  const DatePicker = (props: DatePickerProps) => {
    const makeSingleDate = (date: Date | Date[] | undefined) => {
      let singleDate = Array.isArray(date) ? date[0] : date;
      singleDate = singleDate || new Date();
      return singleDate;
    };

    const handleDateChanged = (date: Date | Date[]) => {
      const singleDate = makeSingleDate(date);
      console.log(singleDate);
      formik.setFieldValue("executionDate", singleDate.toISOString());
      formik.setTouched({ ...formik.touched, executionDate: true }, true);
    };

    return (
      <ReactDatePicker
        onChange={handleDateChanged}
        value={parseISO(formik.values.executionDate)}
        {...props}
      />
    );
  };

  return (
    <>
      {request && (
        <Form noValidate>
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
                    className="custom-select"
                    as="select"
                    disabled={!editing}
                    {...formik.getFieldProps("RequestCardType")}
                    isInvalid={
                      !!(
                        formik.touched.RequestCardType &&
                        formik.errors.RequestCardType
                      )
                    }
                    isValid={
                      formik.touched.RequestCardType &&
                      !formik.errors.RequestCardType
                    }
                  >
                    <option value={""}>Select one</option>
                    {cardTypes.map((type: string) => {
                      return (
                        <option value={type} key={type}>
                          {type}
                        </option>
                      );
                    })}
                  </Form.Control>
                  {formik.touched.RequestCardType &&
                  formik.errors.RequestCardType ? (
                    <small className="text-danger">
                      {formik.errors.RequestCardType}
                    </small>
                  ) : null}
                </Form.Group>
                <Form.Group>
                  <Form.Label>Cardholder</Form.Label>
                  <Form.Control
                    type="text"
                    disabled={!editing}
                    {...formik.getFieldProps("RequestorCardHolderName")}
                    isInvalid={
                      !!(
                        formik.touched.RequestorCardHolderName &&
                        formik.errors.RequestorCardHolderName
                      )
                    }
                    isValid={
                      formik.touched.RequestorCardHolderName &&
                      !formik.errors.RequestorCardHolderName
                    }
                  />
                  {formik.touched.RequestorCardHolderName &&
                  formik.errors.RequestorCardHolderName ? (
                    <small className="text-danger">
                      {formik.errors.RequestorCardHolderName}
                    </small>
                  ) : null}
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
                    placeholder="Enter a phone number"
                    {...formik.getFieldProps("RequestorDSN")}
                    isInvalid={
                      !!(
                        formik.touched.RequestorDSN &&
                        formik.errors.RequestorDSN
                      )
                    }
                    isValid={
                      formik.touched.RequestorDSN && !formik.errors.RequestorDSN
                    }
                  />
                  {formik.touched.RequestorDSN && formik.errors.RequestorDSN ? (
                    <small className="text-danger">
                      {formik.errors.RequestorDSN}
                    </small>
                  ) : null}
                </Form.Group>
                <Form.Group>
                  <Form.Label>Directorate</Form.Label>
                  <Form.Control
                    className="custom-select"
                    as="select"
                    disabled={!editing}
                    {...formik.getFieldProps("RequestorDirectorate")}
                    isInvalid={
                      !!(
                        formik.touched.RequestorDirectorate &&
                        formik.errors.RequestorDirectorate
                      )
                    }
                    isValid={
                      formik.touched.RequestorDirectorate &&
                      !formik.errors.RequestorDirectorate
                    }
                  >
                    <option value={""}>Select one</option>
                    {directorates.map((directorate: string) => {
                      return (
                        <option value={directorate} key={directorate}>
                          {directorate}
                        </option>
                      );
                    })}
                  </Form.Control>
                  {formik.touched.RequestorDirectorate &&
                  formik.errors.RequestorDirectorate ? (
                    <small className="text-danger">
                      {formik.errors.RequestorDirectorate}
                    </small>
                  ) : null}
                </Form.Group>
                <Form.Group>
                  <Form.Label>Funding</Form.Label>
                  <Form.Control
                    className="custom-select"
                    as="select"
                    disabled={!editing}
                    {...formik.getFieldProps("RequestSource")}
                    isInvalid={
                      !!(
                        formik.touched.RequestSource &&
                        formik.errors.RequestSource
                      )
                    }
                    isValid={
                      formik.touched.RequestSource &&
                      !formik.errors.RequestSource
                    }
                  >
                    <option value={""}>Select one</option>
                    {FundingSources.map(src => {
                      return (
                        <option value={src} key={src}>
                          {src}
                        </option>
                      );
                    })}
                  </Form.Control>
                  {formik.touched.RequestSource &&
                  formik.errors.RequestSource ? (
                    <small className="text-danger">
                      {formik.errors.RequestSource}
                    </small>
                  ) : null}
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
                    {...formik.getFieldProps("RequestJustification")}
                    isInvalid={
                      !!(
                        formik.touched.RequestJustification &&
                        formik.errors.RequestJustification
                      )
                    }
                    isValid={
                      formik.touched.RequestJustification &&
                      !formik.errors.RequestJustification
                    }
                  />
                  {formik.touched.RequestJustification &&
                  formik.errors.RequestJustification ? (
                    <small className="text-danger">
                      {formik.errors.RequestJustification}
                    </small>
                  ) : null}
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
                    className="custom-select"
                    as="select"
                    disabled={!editing}
                    {...formik.getFieldProps("RequestIsJ6")}
                    isInvalid={
                      !!(
                        formik.touched.RequestIsJ6 && formik.errors.RequestIsJ6
                      )
                    }
                    isValid={
                      formik.touched.RequestIsJ6 && !formik.errors.RequestIsJ6
                    }
                  >
                    <option value={""}>Select one</option>
                    <option value={"Yes"}>Yes</option>
                    <option value={"No"}>No</option>
                  </Form.Control>
                  {formik.touched.RequestIsJ6 && formik.errors.RequestIsJ6 ? (
                    <small className="text-danger">
                      {formik.errors.RequestIsJ6}
                    </small>
                  ) : null}
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Currency</Form.Label>
                  <Form.Control
                    className="custom-select"
                    as="select"
                    disabled={!editing}
                    {...formik.getFieldProps("RequestCurrencyType")}
                    isInvalid={
                      !!(
                        formik.touched.RequestCurrencyType &&
                        formik.errors.RequestCurrencyType
                      )
                    }
                    isValid={
                      formik.touched.RequestCurrencyType &&
                      !formik.errors.RequestCurrencyType
                    }
                  >
                    <option value={""}>Select one</option>
                    {currencies.map((currency: string) => {
                      return (
                        <option value={currency} key={currency}>
                          {currency}
                        </option>
                      );
                    })}
                  </Form.Control>
                  {formik.touched.RequestCurrencyType &&
                  formik.errors.RequestCurrencyType ? (
                    <small className="text-danger">
                      {formik.errors.RequestCurrencyType}
                    </small>
                  ) : null}
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
                    {...formik.getFieldProps("transactionId")}
                    isInvalid={
                      !!(
                        formik.touched.transactionId &&
                        formik.errors.transactionId
                      )
                    }
                    isValid={
                      formik.touched.transactionId &&
                      !formik.errors.transactionId
                    }
                  />
                  {formik.touched.transactionId &&
                  formik.errors.transactionId ? (
                    <small className="text-danger">
                      {formik.errors.transactionId}
                    </small>
                  ) : null}
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Execution Date</Form.Label>
                  <Form.Control
                    as={DatePicker}
                    disabled={!editing}
                    className={!editing ? "date-picker-locked" : ""}
                    name="executionDate"
                    id="executionDate"
                    isInvalid={
                      !!(
                        formik.touched.executionDate &&
                        formik.errors.executionDate
                      )
                    }
                    isValid={
                      formik.touched.executionDate &&
                      !formik.errors.executionDate
                    }
                  />
                  {formik.touched.executionDate &&
                  formik.errors.executionDate ? (
                    <small className="text-danger">
                      {formik.errors.executionDate}
                    </small>
                  ) : null}
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
                    className="custom-select"
                    as="select"
                    disabled={!editing}
                    {...formik.getFieldProps("fiscalYear")}
                    isInvalid={
                      !!(formik.touched.fiscalYear && formik.errors.fiscalYear)
                    }
                    isValid={
                      formik.touched.fiscalYear && !formik.errors.fiscalYear
                    }
                  >
                    <option value={""}>Select one</option>
                    {fiscalYears.map((year: any) => {
                      return (
                        <option value={year} key={year}>
                          {year}
                        </option>
                      );
                    })}
                  </Form.Control>
                  {formik.touched.fiscalYear && formik.errors.fiscalYear ? (
                    <small className="text-danger">
                      {formik.errors.fiscalYear}
                    </small>
                  ) : null}
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Quarter</Form.Label>
                  <Form.Control
                    className="custom-select"
                    as="select"
                    disabled={!editing}
                    {...formik.getFieldProps("fiscalQuarter")}
                    isInvalid={
                      !!(
                        formik.touched.fiscalQuarter &&
                        formik.errors.fiscalQuarter
                      )
                    }
                    isValid={
                      formik.touched.fiscalQuarter &&
                      !formik.errors.fiscalQuarter
                    }
                  >
                    <option value={""}>Select one</option>
                    {fiscalQuarters.map((quarter: string) => {
                      return (
                        <option value={quarter} key={quarter}>
                          {quarter}
                        </option>
                      );
                    })}
                  </Form.Control>
                  {formik.touched.fiscalQuarter &&
                  formik.errors.fiscalQuarter ? (
                    <small className="text-danger">
                      {formik.errors.fiscalQuarter}
                    </small>
                  ) : null}
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
                                <Form.Control
                                  className="custom-select"
                                  as="select"
                                >
                                  <option value={""}>Select one</option>
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
              <Col className="pt-2">
                <span className="text-white">
                  Save your changes and then sign at the top of this page.
                </span>
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
        </Form>
      )}
    </>
  );
};
