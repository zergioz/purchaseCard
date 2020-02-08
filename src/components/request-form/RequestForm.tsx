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
import { ValidationErrorModal } from "./ValidationErrorModal";
import { useFormik, getIn, validateYupSchema, yupToFormErrors } from "formik";
import ReactDatePicker, {
  DatePickerProps
} from "react-date-picker/dist/entry.nostyle";
import "./DatePicker.css";
import { parseISO, format, isDate } from "date-fns";
import { ConfirmationModal } from "./ConfirmationModal";
import { RequestAttachmentsTable } from "./RequestAttachmentsTable";
import UserContext from "../../contexts/UserContext";
import RoleContext from "../../contexts/RoleContext";
import { Role } from "../../services/models/Role";
import { ApprovalActionsButton } from "../approval-actions-button/ApprovalActionsButton";
import { ApprovalAction } from "../../services/models/ApprovalAction";
import { LineItem } from "../../services/models/LineItem";
import { Observable } from "rxjs";
import { useHistory } from "react-router-dom";
import { ErrorBoundary } from "../error-boundary/ErrorBoundary";
import { RequestSignaturesTable } from "./RequestSignaturesTable";

interface IProps {
  request: Request;
  onRequestUpdated: (newRequest: Request) => Observable<Request>;
  editing: boolean;
  setEditing: (editing: boolean) => void;
}
export const RequestForm = (props: IProps) => {
  const [total, setTotal] = useState<string>("");
  const [discardModalOpen, setDiscardModalOpen] = useState<boolean>(false);
  const [completedModalOpen, setCompletedModalOpen] = useState<boolean>(false);
  const [request, setRequest] = useState<Request>(props.request);
  const [errorModalOpen, setErrorModalOpen] = useState<boolean>(false);
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [canAction, setCanAction] = useState<boolean>(true);
  const { user } = useContext(UserContext);
  const { roles } = useContext(RoleContext);
  const history = useHistory();

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

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: request,
    onSubmit: values => {
      saveRequest(values);
    },
    //instead of using validationSchema, we are manually doing the validation so we can pass
    //the request in to yup as a context.  this is so we can use Yup.when($status) to do conditional
    //validation for the fields like j8 and cardholder that only need to be filled in at a
    //specific step.
    validate: values => {
      return validateForm(values);
    }
  });

  const validateForm = (values: any) => {
    const schema = request.getValidationSchema();
    try {
      validateYupSchema(values, schema, true, request);
    } catch (err) {
      return yupToFormErrors(err);
    }
    return {};
  };

  //recalculate the line item totals whenever the data changes
  useEffect(() => {
    setTotal(formatTotal());
  }, [formik.values.lineItems, formik.values.requestField.RequestCurrencyType]);

  //update our state if the request changes - after an update is sent, for example
  useEffect(() => {
    setRequest(props.request);
  }, [props.request]);

  //when this form loads, calculate and format the line item totals
  useEffect(() => {
    setCanEdit(request.status !== "Closed");
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
    const updatedRequest = new Request({ ...request, ...values });
    formik.resetForm(updatedRequest);
    setRequest(updatedRequest);
    setCanEdit(false);
    setCanAction(false);
    props.onRequestUpdated(updatedRequest).subscribe(
      () => {
        setCanEdit(request.status !== "Closed");
        setCanAction(true);
      },
      () => {
        setCanEdit(request.status !== "Closed");
        setCanAction(true);
      }
    );
  };

  const onSaveClicked = () => {
    if (request.status === "Draft" || request.status == "") {
      saveRequest(formik.values);
    } else {
      //handleSubmit will either submit or cause errors to be shown
      formik.handleSubmit();

      //this captures the errors so we can check for it
      const errors = validateForm(formik.values);
      if (Object.entries(errors).length === 0) {
        //there are no errors, save will go through
      } else {
        setErrorModalOpen(true);
      }
    }
  };

  const onCancelClicked = (confirmed?: boolean) => {
    if (formik.dirty && !confirmed) {
      setDiscardModalOpen(true);
    } else {
      formik.resetForm();
      props.setEditing(false);
    }
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
        const errors = validateForm(formik.values);
        if (Object.entries(errors).length === 0) {
          isAllowed = true;
        } else {
          formik.handleSubmit();
          setErrorModalOpen(true);
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
    //const re = /^[0-9]+(\.[0-9][0-9]?)?/;\
    const re = /^((\d+(\.\d*)?)|(\.\d+))$/;
    if (e.target.value === "" || re.test(e.target.value)) {
      formik.handleChange(e);
      return true;
    }
    return false;
  };

  //calculates total cost of all the line items in the form and outputs a string with dollar or euro symbol
  const formatTotal = (): string => {
    const items = formik.values.lineItems;
    let sum = 0;
    for (var i = 0; i < items.length; i++) {
      sum += items[i].requestTotal;
    }
    return request.formatAmount(sum);
  };

  //this is a wrapper for the react-date-picker control so that it works with Formik and React-Bootstrap
  //todo: remove hardcoded executionDate field name
  const DatePicker = (props: DatePickerProps) => {
    const makeSingleDate = (date: Date | Date[] | undefined) => {
      let singleDate = Array.isArray(date) ? date[0] : date;
      if (!isDate(singleDate)) {
        singleDate = new Date();
      }
      return singleDate;
    };

    const handleDateChanged = (date: Date | Date[]) => {
      const singleDate = makeSingleDate(date);
      formik.setFieldTouched("requestField.executionDate", true, true);
      formik.setFieldValue(
        "requestField.executionDate",
        singleDate ? singleDate.toISOString() : undefined
      );
    };

    const tryParse = (isoString: string): Date => {
      let date = new Date();
      try {
        if (isoString) {
          date = parseISO(isoString);
        }
      } catch (e) {
        console.error(
          `tryParse(request: ${request.id}): Error parsing string`,
          isoString
        );
      }
      return date;
    };

    return (
      <ReactDatePicker
        onChange={handleDateChanged}
        value={
          formik.values.requestField.executionDate
            ? tryParse(formik.values.requestField.executionDate)
            : undefined
        }
        {...props}
      />
    );
  };

  //returns true if a field has validation errors
  const isInvalid = (fieldName: string): boolean => {
    return getIn(formik.touched, fieldName) && getIn(formik.errors, fieldName);
  };

  //returns true if a field has no validation errors
  const isValid = (fieldName: string): boolean => {
    return getIn(formik.touched, fieldName) && !getIn(formik.errors, fieldName);
  };

  //returns the validation error text for a field
  const validationError = (fieldName: string) => {
    return isInvalid(fieldName) ? (
      <small className="text-danger">{getIn(formik.errors, fieldName)}</small>
    ) : null;
  };

  const onRequestUpdated = (newRequest: Request): Observable<Request> => {
    const obs = props.onRequestUpdated(newRequest);
    setCanEdit(false);
    setCanAction(false);
    obs.subscribe(
      req => {
        setCompletedModalOpen(true);
        setCanEdit(newRequest.status !== "Closed");
        setCanAction(true);
      },
      () => {
        setErrorModalOpen(true);
        setCanEdit(newRequest.status !== "Closed");
        setCanAction(true);
      }
    );
    return obs;
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
        onConfirm={() => onCancelClicked(true)}
        title="Discard Changes"
        body="Are you sure you want to discard your changes?"
        confirmText="Yes"
        cancelText="No"
        size="lg"
      />
      <ConfirmationModal
        open={completedModalOpen}
        onHide={() => setCompletedModalOpen(false)}
        onConfirm={() => history.push("/requests")}
        title="Success"
        body="The action was successful!"
        confirmText="Back to Requests"
        cancelText="Stay here"
        size="lg"
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
                <ButtonToolbar className="text-right ">
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
                    onClick={() => onCancelClicked()}
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
                    disabled={props.editing || !canAction}
                    variant="danger"
                    request={request}
                    onRequestUpdated={onRequestUpdated}
                    onBeforeAction={onBeforeAction}
                    actions={new Set(request.getAvailableActions())}
                  />
                </ButtonToolbar>
              </Col>
            </Row>
          </Form.Group>
          <Form.Group className="bg-light p-3">
            <legend>Request Details</legend>
            <hr />
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
                    {...formik.getFieldProps("requestField.RequestCardType")}
                    isInvalid={isInvalid(`requestField.RequestCardType`)}
                    isValid={isValid(`requestField.RequestCardType`)}
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
                  {validationError(`requestField.RequestCardType`)}
                </Form.Group>
                <Form.Group>
                  <Form.Label>Cardholder</Form.Label>
                  <Form.Control
                    className="custom-select"
                    as="select"
                    disabled={!props.editing}
                    {...formik.getFieldProps(
                      "requestField.RequestorCardHolderName"
                    )}
                    isInvalid={isInvalid(
                      `requestField.RequestorCardHolderName`
                    )}
                    isValid={isValid(`requestField.RequestorCardHolderName`)}
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
                  {validationError(`requestField.RequestorCardHolderName`)}
                </Form.Group>
                <Form.Group>
                  <Form.Label>Request Date</Form.Label>
                  <ErrorBoundary>
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
                  </ErrorBoundary>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>
                    Requestor DSN{" "}
                    <span className="text-secondary">(###-###-####)</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    disabled={!props.editing}
                    placeholder="Enter a 10 digit phone number"
                    {...formik.getFieldProps("requestField.RequestorDSN")}
                    isInvalid={isInvalid(`requestField.RequestorDSN`)}
                    isValid={isValid(`requestField.RequestorDSN`)}
                  />
                  {validationError(`requestField.RequestorDSN`)}
                </Form.Group>
                <Form.Group>
                  <Form.Label>Directorate</Form.Label>
                  <Form.Control
                    className="custom-select"
                    as="select"
                    disabled={!props.editing}
                    {...formik.getFieldProps(
                      "requestField.RequestorDirectorate"
                    )}
                    isInvalid={isInvalid(`requestField.RequestorDirectorate`)}
                    isValid={isValid(`requestField.RequestorDirectorate`)}
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
                  {validationError(`requestField.RequestorDirectorate`)}
                </Form.Group>
                <Form.Group>
                  <Form.Label>Funding</Form.Label>
                  <Form.Control
                    className="custom-select"
                    as="select"
                    disabled={!props.editing}
                    {...formik.getFieldProps("requestField.RequestSource")}
                    isInvalid={isInvalid(`requestField.RequestSource`)}
                    isValid={isValid(`requestField.RequestSource`)}
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
                  {validationError(`requestField.RequestSource`)}
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
                    {...formik.getFieldProps(
                      "requestField.RequestJustification"
                    )}
                    isInvalid={isInvalid(`requestField.RequestJustification`)}
                    isValid={isValid(`requestField.RequestJustification`)}
                  />
                  {validationError(`requestField.RequestJustification`)}
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
                    {...formik.getFieldProps("requestField.RequestIsJ6")}
                    isInvalid={isInvalid(`requestField.RequestIsJ6`)}
                    isValid={isValid(`requestField.RequestIsJ6`)}
                  >
                    <option value={""}>Select one</option>
                    <option value={"Yes"}>Yes</option>
                    <option value={"No"}>No</option>
                  </Form.Control>
                  {validationError(`requestField.RequestIsJ6`)}
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Currency</Form.Label>
                  <Form.Control
                    className="custom-select"
                    as="select"
                    disabled={!props.editing}
                    {...formik.getFieldProps(
                      "requestField.RequestCurrencyType"
                    )}
                    isInvalid={isInvalid(`requestField.RequestCurrencyType`)}
                    isValid={isValid(`requestField.RequestCurrencyType`)}
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
                  {validationError(`requestField.RequestCurrencyType`)}
                </Form.Group>
              </Col>
            </Row>
          </Form.Group>
          <Form.Group className="p-3 bg-light">
            <legend>Line Items</legend>
            <hr />
            <Row>
              <Col>
                <Table responsive borderless>
                  <tbody style={{ borderTop: "1px solid #dee2e6" }}>
                    <tr></tr>
                    {formik.values.lineItems &&
                      formik.values.lineItems &&
                      formik.values.lineItems.map(
                        (item: LineItem, index: number) => {
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
                                      {...formik.getFieldProps(
                                        `lineItems[${index}].requestQty`
                                      )}
                                      onChange={(e: any) => {
                                        if (handleNumbersOnlyChange(e)) {
                                          formik.setFieldValue(
                                            `lineItems[${index}].requestTotal`,
                                            Math.ceil(
                                              formik.values.lineItems[index]
                                                .requestCost *
                                                e.target.value *
                                                100
                                            ) / 100
                                          );
                                        }
                                      }}
                                      isInvalid={isInvalid(
                                        `lineItems[${index}].requestQty`
                                      )}
                                      isValid={isValid(
                                        `lineItems[${index}].requestQty`
                                      )}
                                    />
                                    {validationError(
                                      `lineItems[${index}].requestQty`
                                    )}
                                  </Form.Group>
                                </td>

                                <td className="p-1">
                                  <Form.Group>
                                    <Form.Label>Unit Cost/Rate</Form.Label>
                                    <InputGroup>
                                      <InputGroup.Prepend>
                                        <InputGroup.Text>
                                          {formik.values.requestField
                                            .RequestCurrencyType == "Euro"
                                            ? "€"
                                            : "$"}
                                        </InputGroup.Text>
                                      </InputGroup.Prepend>
                                      <Form.Control
                                        type="text"
                                        disabled={!props.editing}
                                        {...formik.getFieldProps(
                                          `lineItems[${index}].requestCost`
                                        )}
                                        onChange={(e: any) => {
                                          if (handleNumbersOnlyChange(e)) {
                                            formik.setFieldValue(
                                              `lineItems[${index}].requestTotal`,
                                              Math.ceil(
                                                formik.values.lineItems[index]
                                                  .requestQty *
                                                  e.target.value *
                                                  100
                                              ) / 100
                                            );
                                          }
                                        }}
                                        isInvalid={isInvalid(
                                          `lineItems[${index}].requestCost`
                                        )}
                                        isValid={isValid(
                                          `lineItems[${index}].requestCost`
                                        )}
                                      />
                                    </InputGroup>
                                    {validationError(
                                      `lineItems[${index}].requestCost`
                                    )}
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
                                        formik.values.lineItems[index]
                                          .requestDdForm === true
                                          ? true
                                          : false
                                      }
                                      name={`lineItems[${index}].requestDdForm`}
                                      id={`lineItems[${index}].requestDdForm`}
                                      onChange={formik.handleChange}
                                      isInvalid={isInvalid(
                                        `lineItems[${index}].requestDdForm`
                                      )}
                                      isValid={isValid(
                                        `lineItems[${index}].requestDdForm`
                                      )}
                                    />
                                    {validationError(
                                      `lineItems[${index}].requestDdForm`
                                    )}
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
                                        formik.values.lineItems[index]
                                          .requestDaForm === true
                                          ? true
                                          : false
                                      }
                                      name={`lineItems[${index}].requestDaForm`}
                                      id={`lineItems[${index}].requestDaForm`}
                                      onChange={formik.handleChange}
                                      isInvalid={isInvalid(
                                        `lineItems[${index}].requestDaForm`
                                      )}
                                      isValid={isValid(
                                        `lineItems[${index}].requestDaForm`
                                      )}
                                    />
                                    {validationError(
                                      `lineItems[${index}].requestDaForm`
                                    )}
                                  </Form.Group>
                                </td>
                                <td className="p-1">
                                  <Form.Group>
                                    <Form.Label>Total Cost</Form.Label>
                                    <InputGroup>
                                      <InputGroup.Prepend>
                                        <InputGroup.Text>
                                          {formik.values.requestField
                                            .RequestCurrencyType == "Euro"
                                            ? "€"
                                            : "$"}
                                        </InputGroup.Text>
                                      </InputGroup.Prepend>
                                      <Form.Control
                                        type="text"
                                        disabled={true}
                                        {...formik.getFieldProps(
                                          `lineItems[${index}].requestTotal`
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
                                          {...formik.getFieldProps(
                                            `lineItems[${index}].requestDesc`
                                          )}
                                          onChange={formik.handleChange}
                                          placeholder="Enter a description of the item being purchased"
                                          isInvalid={isInvalid(
                                            `lineItems[${index}].requestDesc`
                                          )}
                                          isValid={isValid(
                                            `lineItems[${index}].requestDesc`
                                          )}
                                        />
                                        {validationError(
                                          `lineItems[${index}].requestDesc`
                                        )}
                                      </Form.Group>
                                    </Col>
                                    <Col>
                                      <Form.Group>
                                        <Form.Label>Vendor/Source</Form.Label>
                                        <Form.Control
                                          as="textarea"
                                          type="text"
                                          disabled={!props.editing}
                                          {...formik.getFieldProps(
                                            `lineItems[${index}].requestSrc`
                                          )}
                                          onChange={formik.handleChange}
                                          placeholder="Enter the vendor name or URL"
                                          isInvalid={isInvalid(
                                            `lineItems[${index}].requestSrc`
                                          )}
                                          isValid={isValid(
                                            `lineItems[${index}].requestSrc`
                                          )}
                                        />
                                        {validationError(
                                          `lineItems[${index}].requestSrc`
                                        )}
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
                                        const array = formik.values.lineItems.filter(
                                          i => i.id !== item.id
                                        );
                                        formik.setFieldValue(
                                          "lineItems",
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
                            formik.setFieldValue("lineItems", [
                              ...formik.values.lineItems,
                              new LineItem()
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
          {request.isPast("Finance", true) && (
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
                      {...formik.getFieldProps("requestField.fiscalYear")}
                      isInvalid={isInvalid(`requestField.fiscalYear`)}
                      isValid={isValid(`requestField.fiscalYear`)}
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
                    {validationError(`requestField.fiscalYear`)}
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Purchase Number</Form.Label>
                    <Form.Control
                      type="text"
                      disabled={!props.editing}
                      placeholder="Enter purchase number"
                      {...formik.getFieldProps("requestField.purchaseNumber")}
                      isInvalid={isInvalid(`requestField.purchaseNumber`)}
                      isValid={isValid(`requestField.purchaseNumber`)}
                    />
                    {validationError(`requestField.purchaseNumber`)}
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Quarter</Form.Label>
                    <Form.Control
                      className="custom-select"
                      as="select"
                      disabled={!props.editing}
                      {...formik.getFieldProps("requestField.fiscalQuarter")}
                      isInvalid={isInvalid(`requestField.fiscalQuarter`)}
                      isValid={isValid(`requestField.fiscalQuarter`)}
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
                    {validationError(`requestField.fiscalQuarter`)}
                  </Form.Group>
                </Col>
              </Row>
            </Form.Group>
          )}
          {request.isPast("Cardholder", true) && (
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
                      {...formik.getFieldProps("requestField.transactionId")}
                      isInvalid={isInvalid(`requestField.transactionId`)}
                      isValid={isValid(`requestField.transactionId`)}
                    />
                    {validationError(`requestField.transactionId`)}
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Execution Date</Form.Label>
                    <ErrorBoundary>
                      <Form.Control
                        as={DatePicker}
                        disabled={!props.editing}
                        className={!props.editing ? "date-picker-locked" : ""}
                        name="requestField.executionDate"
                        id="requestField.executionDate"
                        isInvalid={isInvalid(`requestField.executionDate`)}
                        isValid={isValid(`requestField.executionDate`)}
                      />
                    </ErrorBoundary>
                    {validationError(`requestField.executionDate`)}
                  </Form.Group>
                </Col>
              </Row>
            </Form.Group>
          )}
          {request.status !== "Draft" && request.status !== "" && (
            <Form.Group className="bg-light p-3">
              <Row>
                <Col>
                  <legend>Signatures</legend>
                </Col>
                <Col className="text-right">
                  <ApprovalActionsButton
                    className="p-1"
                    disabled={props.editing || !canAction}
                    variant="danger"
                    request={request}
                    onRequestUpdated={onRequestUpdated}
                    onBeforeAction={onBeforeAction}
                    actions={new Set(request.getAvailableActions())}
                  />
                </Col>
              </Row>
              <RequestSignaturesTable request={request} />
            </Form.Group>
          )}
          <Form.Group className="bg-secondary p-3">
            <Row>
              <Col className="pt-2">
                <span className="text-white ">
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
                    onClick={() => onCancelClicked()}
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
                    disabled={props.editing || !canAction}
                    variant="danger"
                    request={request}
                    onRequestUpdated={onRequestUpdated}
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
