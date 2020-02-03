import React, { useState, useEffect, useContext } from "react";
import { Request } from "../../services/models/Request";
import {
  Form,
  Row,
  Col,
  ButtonToolbar,
  Button,
  Table,
  InputGroup
} from "react-bootstrap";
import { FundingSources } from "../../constants/FundingSources";
import { PersonDirectorates as directorates } from "../../constants/PersonDirectorates";
import { CardTypes as cardTypes } from "../../constants/CardTypes";
import { Currencies as currencies } from "../../constants/Currencies";
import { FiscalYears as fiscalYears } from "../../constants/FiscalYears";
import { FiscalQuarters as fiscalQuarters } from "../../constants/FiscalQuarters";
import { FaPlus, FaTimes } from "react-icons/fa";
import { Detail } from "../../services/models/PurchaseDetails";
import { ValidationErrorModal } from "./ValidationErrorModal";
import { useFormik } from "formik";
import ReactDatePicker, {
  DatePickerProps
} from "react-date-picker/dist/entry.nostyle";
import "./DatePicker.css";
import { parseISO, format } from "date-fns";
import { ConfirmationModal } from "./ConfirmationModal";
import { RequestAttachmentsTable } from "./RequestAttachmentsTable";
import UserContext from "../../contexts/UserContext";
import RoleContext from "../../contexts/RoleContext";
import { Role } from "../../services/models/Role";
import { ApprovalActionsButton } from "../approval-actions-button/ApprovalActionsButton";
import { ApprovalAction } from "../../services/models/ApprovalAction";

interface IProps {
  request: Request;
  onRequestUpdated: (newRequest: Request) => void;
  editing: boolean;
  setEditing: (editing: boolean) => void;
}
export const RequestForm = (props: IProps) => {
  const [total, setTotal] = useState<string>("");
  const [discardModalOpen, setDiscardModalOpen] = useState<boolean>(false);
  const [request, setRequest] = useState<Request>(props.request);
  const [errorModalOpen, setErrorModalOpen] = useState<boolean>(false);
  const { user } = useContext(UserContext);
  const { roles } = useContext(RoleContext);

  const cardholders = roles
    .filter(role => role.role === "CARD HOLDER" && role.active)
    .sort((a: Role, b: Role) => {
      if (a.directorate < b.directorate) {
        return -1;
      }
      if (a.directorate > b.directorate) {
        return 1;
      }
      return 0;
    });

  const canEdit = request.status !== "Closed";

  //show cardholder fields in these statuses
  const cardholderFieldStatuses = new Set([
    "Cardholder",
    "Requestor",
    "Supply",
    "PBO Final",
    "BO Final",
    "Closed"
  ]);

  //show j8 fields in these statuses
  const j8FieldStatuses = new Set([
    "Finance",
    "Cardholder",
    "Requestor",
    "Supply",
    "PBO Final",
    "BO Final",
    "Closed"
  ]);

  const formik = useFormik({
    initialValues: {
      ...request.requestField,
      purchaseDetails: request.purchaseDetails.Details
    },
    onSubmit: values => {
      saveRequest(values);
    },
    validationSchema: new Request().getValidationSchema()
  });

  //recalculate the line item totals whenever the data changes
  useEffect(() => {
    setTotal(formatTotal());
  }, [formik.values.purchaseDetails, formik.values.RequestCurrencyType]);

  //update our state if the request changes - after an update is sent, for example
  useEffect(() => {
    setRequest(props.request);
  }, [props.request]);

  //when this form loads, calculate and format the line item totals
  useEffect(() => {
    setTotal(formatTotal());
  }, []);

  //saves the request regardless of validation.  for validation use formik.handleSubmit()
  const saveRequest = (values: any) => {
    updateRequest(values);
    formik.setSubmitting(false);
    formik.setErrors({});
    formik.setTouched({});
  };

  const updateRequest = (values: any) => {
    props.setEditing(false);
    //todo: use nested initial values and rename all our controls.  formik can handle it
    const updatedRequest = new Request({
      ...request,
      requestField: { ...values, purchaseDetails: undefined },
      purchaseDetails: { Details: values.purchaseDetails }
    });
    setRequest(updatedRequest);
    props.onRequestUpdated(updatedRequest);
  };

  const onSaveClicked = () => {
    if (request.status === "Draft") {
      saveRequest(formik.values);
    } else {
      if (!formik.isValid) {
        setErrorModalOpen(true);
      }

      formik.handleSubmit();
    }
  };

  const onCancelClicked = () => {
    formik.resetForm();
    props.setEditing(false);
  };

  //unlocks the form fields
  const onEditClicked = () => {
    props.setEditing(true);
  };

  //the approval actions button calls this before an action is taken.  return true to continue the action
  //or false to cancel the action.  we're using this validate the form fields before submission or signature
  const onBeforeAction = (action: ApprovalAction): boolean => {
    let isAllowed = true;
    switch (action.type) {
      case "approve":
      case "submit":
        if (formik.isValid) {
          isAllowed = true;
        } else {
          setErrorModalOpen(true);
          formik.handleSubmit();
          isAllowed = false;
        }
        break;
      case "delete":
      case "clone":
      case "reject":
      default:
        isAllowed = true;
        break;
    }
    return isAllowed;
  };

  //this onChange handler is for number inputs - allows decimal points but blocks all
  //other non-numeric characters.  used for qty and cost inputs
  const handleNumbersOnlyChange = (e: any): boolean => {
    //const re = /^[0-9\b]+$/;
    //const re = /^[0-9]+(\.[0-9][0-9]?)?/;
    const re = /^((\d+(\.\d*)?)|(\.\d+))$/;
    if (e.target.value === "" || re.test(e.target.value)) {
      formik.handleChange(e);
      return true;
    }
    return false;
  };

  //calculates total cost of all the line items in the form and outputs a string with dollar or euro symbol
  const formatTotal = (): string => {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: formik.values.RequestCurrencyType === "Euro" ? "EUR" : "USD",
      minimumFractionDigits: 2
    });
    const items = formik.values.purchaseDetails;
    let sum = 0;
    for (var i = 0; i < items.length; i++) {
      sum += items[i].requestTotal;
    }
    console.log(sum);
    return formatter.format(sum);
  };

  //this is a wrapper for the react-date-picker control so that it works with Formik and React-Bootstrap
  //todo: remove hardcoded executionDate field name
  const DatePicker = (props: DatePickerProps) => {
    const makeSingleDate = (date: Date | Date[] | undefined) => {
      let singleDate = Array.isArray(date) ? date[0] : date;
      return singleDate;
    };

    const handleDateChanged = (date: Date | Date[]) => {
      const singleDate = makeSingleDate(date);
      console.log(singleDate);
      formik.setFieldTouched("executionDate", true, true);
      formik.setFieldValue(
        "executionDate",
        singleDate ? singleDate.toISOString() : undefined
      );
    };

    return (
      <ReactDatePicker
        onChange={handleDateChanged}
        value={
          formik.values.executionDate
            ? parseISO(formik.values.executionDate)
            : undefined
        }
        {...props}
      />
    );
  };

  return (
    <>
      {/* modals */}
      <ValidationErrorModal
        show={errorModalOpen}
        onHide={() => setErrorModalOpen(false)}
      />
      <ConfirmationModal
        open={discardModalOpen}
        onHide={() => setDiscardModalOpen(false)}
        onConfirm={() => onCancelClicked()}
        title="Discard Changes"
        body="Are you sure you want to discard your changes?"
        confirmText="Yes"
        cancelText="No"
      />
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
                <ButtonToolbar className="text-right h-50">
                  <Button
                    disabled={!canEdit}
                    className="m-1"
                    variant="outline-light"
                    hidden={props.editing}
                    onClick={() => onEditClicked()}
                  >
                    Edit this request
                  </Button>
                  <Button
                    className="m-1"
                    variant="outline-light"
                    hidden={!props.editing}
                    onClick={() => setDiscardModalOpen(true)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="m-1"
                    variant="primary"
                    hidden={!props.editing}
                    onClick={() => onSaveClicked()}
                  >
                    Save Changes
                  </Button>
                  <ApprovalActionsButton
                    className="p-1"
                    disabled={props.editing}
                    variant="danger"
                    request={request}
                    onRequestUpdated={props.onRequestUpdated}
                    onBeforeAction={onBeforeAction}
                    actions={new Set(request.getAvailableActions())}
                  />
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
                    value={request.author.Title || user!.Title}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Card Type</Form.Label>
                  <Form.Control
                    className="custom-select"
                    as="select"
                    disabled={!props.editing}
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
                    className="custom-select"
                    as="select"
                    disabled={!props.editing}
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
                  >
                    <option value={""}>Select one</option>
                    {cardholders.map((role: Role) => {
                      return (
                        <option
                          value={role.email}
                          key={`role-${role.id}-${role.lastName}`}
                        >
                          {`[${role.directorate}] ${role.firstName} ${role.lastName}`}
                        </option>
                      );
                    })}
                  </Form.Control>
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
                    disabled={!props.editing}
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
                    disabled={!props.editing}
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
                    disabled={!props.editing}
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
                    disabled={!props.editing}
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
                    disabled={!props.editing}
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
                    disabled={!props.editing}
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
          <Form.Group className="p-3 bg-light">
            <legend>Line Items</legend>
            <Row>
              <Col>
                <Table responsive borderless>
                  <tbody style={{ borderTop: "1px solid #dee2e6" }}>
                    <tr></tr>
                    {formik.values.purchaseDetails &&
                      formik.values.purchaseDetails.map(
                        (item: Detail, index: number) => {
                          const isEven = (index + 1) % 2 === 0;
                          const rowBgColor = isEven ? "#dee2e6" : "";
                          const rowBgColorDarker = isEven ? "#dee2e6" : "";
                          const lightRed = "#ffe1e1";
                          return (
                            <React.Fragment
                              key={`line-item-${index}-${item.id}-cost`}
                            >
                              <tr
                                style={{
                                  background: rowBgColor
                                }}
                              >
                                <td
                                  style={{
                                    width: "1%",
                                    background: rowBgColorDarker,
                                    borderRight: "1px solid #ccc"
                                  }}
                                ></td>
                                <td className="p-1">
                                  <Form.Group>
                                    <Form.Label>Quantity</Form.Label>
                                    <Form.Control
                                      type="text"
                                      disabled={!props.editing}
                                      name={`purchaseDetails[${index}].requestQty`}
                                      id={`purchaseDetails[${index}].requestQty`}
                                      value={formik.values.purchaseDetails[
                                        index
                                      ].requestQty.toString()}
                                      onChange={(e: any) => {
                                        if (handleNumbersOnlyChange(e)) {
                                          formik.setFieldValue(
                                            `purchaseDetails[${index}].requestTotal`,
                                            Math.ceil(
                                              formik.values.purchaseDetails[
                                                index
                                              ].requestCost *
                                                e.target.value *
                                                100
                                            ) / 100
                                          );
                                        }
                                      }}
                                    />
                                  </Form.Group>
                                </td>

                                <td className="p-1">
                                  <Form.Group>
                                    <Form.Label>Unit Cost/Rate</Form.Label>
                                    <InputGroup className="mb-3">
                                      <InputGroup.Prepend>
                                        <InputGroup.Text>
                                          {formik.values.RequestCurrencyType ==
                                          "Euro"
                                            ? "€"
                                            : "$"}
                                        </InputGroup.Text>
                                      </InputGroup.Prepend>
                                      <Form.Control
                                        type="text"
                                        disabled={!props.editing}
                                        name={`purchaseDetails[${index}].requestCost`}
                                        id={`purchaseDetails[${index}].requestCost`}
                                        value={formik.values.purchaseDetails[
                                          index
                                        ].requestCost.toString()}
                                        onChange={(e: any) => {
                                          if (handleNumbersOnlyChange(e)) {
                                            formik.setFieldValue(
                                              `purchaseDetails[${index}].requestTotal`,
                                              Math.ceil(
                                                formik.values.purchaseDetails[
                                                  index
                                                ].requestQty *
                                                  e.target.value *
                                                  100
                                              ) / 100
                                            );
                                          }
                                        }}
                                      />
                                    </InputGroup>
                                  </Form.Group>
                                </td>
                                <td className="text-center p-1">
                                  <Form.Group>
                                    <Form.Label>DD-250</Form.Label>
                                    <Form.Check
                                      className="mt-2"
                                      type="checkbox"
                                      disabled={!props.editing}
                                      checked={
                                        formik.values.purchaseDetails[index]
                                          .requestDdForm === true
                                          ? true
                                          : false
                                      }
                                      name={`purchaseDetails[${index}].requestDdForm`}
                                      id={`purchaseDetails[${index}].requestDdForm`}
                                      onChange={formik.handleChange}
                                    />
                                  </Form.Group>
                                </td>
                                <td className="text-center p-1">
                                  <Form.Group>
                                    <Form.Label>DA-2062</Form.Label>
                                    <Form.Check
                                      className="mt-2"
                                      type="checkbox"
                                      disabled={!props.editing}
                                      checked={
                                        formik.values.purchaseDetails[index]
                                          .requestDaForm === true
                                          ? true
                                          : false
                                      }
                                      name={`purchaseDetails[${index}].requestDaForm`}
                                      id={`purchaseDetails[${index}].requestDaForm`}
                                      onChange={formik.handleChange}
                                    />
                                  </Form.Group>
                                </td>
                                <td className="p-1">
                                  <Form.Group>
                                    <Form.Label>Total Cost</Form.Label>
                                    <InputGroup className="mb-3">
                                      <InputGroup.Prepend>
                                        <InputGroup.Text>
                                          {formik.values.RequestCurrencyType ==
                                          "Euro"
                                            ? "€"
                                            : "$"}
                                        </InputGroup.Text>
                                      </InputGroup.Prepend>
                                      <Form.Control
                                        type="text"
                                        disabled={true}
                                        {...formik.getFieldProps(
                                          `purchaseDetails[${index}].requestTotal`
                                        )}
                                      />
                                    </InputGroup>
                                  </Form.Group>
                                </td>
                                <td
                                  style={{
                                    background: props.editing ? lightRed : ""
                                  }}
                                ></td>
                              </tr>
                              <tr
                                key={`line-item-${index}-${item.id}-desc`}
                                style={{
                                  background: rowBgColor,
                                  borderBottom: `1px solid #ccc`
                                }}
                              >
                                <td
                                  className="pt-1"
                                  style={{
                                    background: rowBgColorDarker,
                                    borderRight: "1px solid #ccc"
                                  }}
                                >
                                  <b>{`#${index + 1}`}</b>
                                </td>
                                <td className="p-1" colSpan={5}>
                                  <Row>
                                    <Col>
                                      <Form.Group>
                                        <Form.Label>Description</Form.Label>
                                        <Form.Control
                                          as="textarea"
                                          type="text"
                                          disabled={!props.editing}
                                          name={`purchaseDetails[${index}].requestDesc`}
                                          id={`purchaseDetails[${index}].requestDesc`}
                                          value={
                                            formik.values.purchaseDetails[index]
                                              .requestDesc
                                          }
                                          onChange={formik.handleChange}
                                          placeholder="Enter a description of the item being purchased"
                                        />
                                      </Form.Group>
                                    </Col>
                                    <Col>
                                      <Form.Group>
                                        <Form.Label>Vendor/Source</Form.Label>
                                        <Form.Control
                                          as="textarea"
                                          type="text"
                                          disabled={!props.editing}
                                          name={`purchaseDetails[${index}].requestSrc`}
                                          id={`purchaseDetails[${index}].requestSrc`}
                                          value={
                                            formik.values.purchaseDetails[index]
                                              .requestSrc
                                          }
                                          onChange={formik.handleChange}
                                          placeholder="Enter the vendor name or URL"
                                        />
                                      </Form.Group>
                                    </Col>
                                  </Row>
                                </td>
                                <td
                                  className="p-1"
                                  style={{
                                    background: props.editing ? "#ffe1e1" : ""
                                  }}
                                >
                                  <span className="text-danger">
                                    <FaTimes
                                      title="Delete this line"
                                      className="mt-2"
                                      style={{
                                        cursor: "pointer",
                                        display: props.editing
                                          ? "inherit"
                                          : "none"
                                      }}
                                      onClick={() => {
                                        const array = formik.values.purchaseDetails.filter(
                                          i => i.id !== item.id
                                        );
                                        formik.setFieldValue(
                                          "purchaseDetails",
                                          array
                                        );
                                      }}
                                    />
                                  </span>
                                </td>
                              </tr>
                            </React.Fragment>
                          );
                        }
                      )}
                  </tbody>
                  <tfoot>
                    <tr style={{ borderTop: `1px solid #dee2e6` }}>
                      <th style={{ width: "1%" }}></th>
                      <th>Totals</th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th className="text-right">
                        <span className="pl-3">{total}</span>
                      </th>
                      <th style={{ width: "1%" }}></th>
                    </tr>
                    <tr>
                      <td colSpan={7} align="right">
                        <Button
                          variant="outline-primary"
                          disabled={!props.editing}
                          onClick={() => {
                            formik.setFieldValue("purchaseDetails", [
                              ...formik.values.purchaseDetails,
                              new Detail()
                            ]);
                          }}
                        >
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
                <RequestAttachmentsTable
                  editing={props.editing}
                  request={request}
                />
              </Col>
            </Row>
          </Form.Group>
          {cardholderFieldStatuses.has(request.status) && (
            <Form.Group className="bg-light p-3">
              <legend>
                Cardholder Data{" "}
                <small className="text-secondary">
                  (to be completed by Cardholder)
                </small>
              </legend>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Transaction ID</Form.Label>
                    <Form.Control
                      type="text"
                      disabled={!props.editing}
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
                      disabled={!props.editing}
                      className={!props.editing ? "date-picker-locked" : ""}
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
          )}
          {j8FieldStatuses.has(request.status) && (
            <Form.Group className="bg-light p-3">
              <legend>
                J8 Data{" "}
                <small className="text-secondary">
                  (to be completed by J8)
                </small>
              </legend>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Fiscal Year</Form.Label>
                    <Form.Control
                      className="custom-select"
                      as="select"
                      disabled={!props.editing}
                      {...formik.getFieldProps("fiscalYear")}
                      isInvalid={
                        !!(
                          formik.touched.fiscalYear && formik.errors.fiscalYear
                        )
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
                      disabled={!props.editing}
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
          )}
          <Form.Group className="bg-secondary p-3">
            <Row>
              <Col className="pt-2">
                <span className="text-white">
                  Use the actions button to sign this form.
                </span>
              </Col>
              <Col className="d-flex justify-content-end">
                <ButtonToolbar className="text-right">
                  <Button
                    disabled={!canEdit}
                    className="m-1"
                    variant="outline-light"
                    hidden={props.editing}
                    onClick={() => onEditClicked()}
                  >
                    Edit this request
                  </Button>
                  <Button
                    className="m-1"
                    variant="outline-light"
                    hidden={!props.editing}
                    onClick={() => setDiscardModalOpen(true)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="m-1"
                    variant="primary"
                    hidden={!props.editing}
                    onClick={() => onSaveClicked()}
                  >
                    Save Changes
                  </Button>
                  <ApprovalActionsButton
                    className="p-1"
                    disabled={props.editing}
                    variant="danger"
                    request={request}
                    onRequestUpdated={props.onRequestUpdated}
                    onBeforeAction={onBeforeAction}
                    actions={new Set(request.getAvailableActions())}
                  />
                </ButtonToolbar>
              </Col>
            </Row>
          </Form.Group>
        </Form>
      )}
    </>
  );
};
