import React, { useState, useEffect } from "react";
import { Detail } from "../../services/models/PurchaseDetails";
import { Form, InputGroup } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import { useFormik } from "formik";
import { ConfirmationModal } from "./ConfirmationModal";

interface IProps {
  item: Detail;
  editing: boolean;
  currency: string;
  onDeleteClicked: (item: Detail) => void;
  onChange: (values: Detail) => void;
}
export const LineItemForm = (props: IProps) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const formik = useFormik({
    initialValues: {
      ...props.item
    },
    onSubmit: values => {},
    validationSchema: new Detail().getValidationSchema()
  });

  //call the outside onChange handler when the formik values change
  //todo: use actual formik subform logic to do this
  useEffect(() => {
    props.onChange(new Detail(formik.values));
  }, [formik.values]);

  //when the editing state changes, reset the validation on this line
  //todo: validation errors on this subform should actually stop the submission
  useEffect(() => {
    formik.setSubmitting(false);
    formik.setErrors({});
    formik.setTouched({});
  }, [props.editing]);

  return (
    <>
      <tr>
        <td className="p-1" style={{ width: "8%" }}>
          <Form.Group>
            <Form.Control
              type="number"
              disabled={!props.editing}
              {...formik.getFieldProps("requestQty")}
              isInvalid={
                !!(formik.touched.requestQty && formik.errors.requestQty)
              }
              isValid={formik.touched.requestQty && !formik.errors.requestQty}
            />
            {formik.touched.requestQty && formik.errors.requestQty ? (
              <small className="text-danger">{formik.errors.requestQty}</small>
            ) : null}
          </Form.Group>
        </td>
        <td className="p-1">
          <Form.Group>
            <Form.Control
              type="text"
              disabled={!props.editing}
              {...formik.getFieldProps("requestDesc")}
              placeholder="Description"
              isInvalid={
                !!(formik.touched.requestDesc && formik.errors.requestDesc)
              }
              isValid={formik.touched.requestDesc && !formik.errors.requestDesc}
            />
            {formik.touched.requestDesc && formik.errors.requestDesc ? (
              <small className="text-danger">{formik.errors.requestDesc}</small>
            ) : null}
          </Form.Group>
        </td>
        <td className="p-1">
          <Form.Group>
            <Form.Control
              type="text"
              disabled={!props.editing}
              {...formik.getFieldProps("requestSrc")}
              placeholder="Source"
              isInvalid={
                !!(formik.touched.requestSrc && formik.errors.requestSrc)
              }
              isValid={formik.touched.requestSrc && !formik.errors.requestSrc}
            />
            {formik.touched.requestSrc && formik.errors.requestSrc ? (
              <small className="text-danger">{formik.errors.requestSrc}</small>
            ) : null}
          </Form.Group>
        </td>
        <td className="p-1" style={{ width: "15%" }}>
          <Form.Group>
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text>
                  {props.currency == "Euro" ? "€" : "$"}
                </InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                type="number"
                disabled={!props.editing}
                {...formik.getFieldProps("requestCost")}
                isInvalid={
                  !!(formik.touched.requestCost && formik.errors.requestCost)
                }
                isValid={
                  formik.touched.requestCost && !formik.errors.requestCost
                }
              />
              {formik.touched.requestCost && formik.errors.requestCost ? (
                <small className="text-danger">
                  {formik.errors.requestCost}
                </small>
              ) : null}
            </InputGroup>
          </Form.Group>
        </td>
        <td className="text-center p-1" style={{ width: "5%" }}>
          <Form.Group>
            <Form.Check
              type="checkbox"
              disabled={!props.editing}
              checked={formik.values.requestDdForm === true ? true : false}
              {...formik.getFieldProps("requestDdForm")}
              isInvalid={
                !!(formik.touched.requestDdForm && formik.errors.requestDdForm)
              }
              isValid={
                formik.touched.requestDdForm && !formik.errors.requestDdForm
              }
            />
            {formik.touched.requestDdForm && formik.errors.requestDdForm ? (
              <small className="text-danger">
                {formik.errors.requestDdForm}
              </small>
            ) : null}
          </Form.Group>
        </td>
        <td className="text-center p-1" style={{ width: "5%" }}>
          <Form.Group>
            <Form.Check
              type="checkbox"
              disabled={!props.editing}
              checked={formik.values.requestDaForm === true ? true : false}
              {...formik.getFieldProps("requestDaForm")}
              isInvalid={
                !!(formik.touched.requestDaForm && formik.errors.requestDaForm)
              }
              isValid={
                formik.touched.requestDaForm && !formik.errors.requestDaForm
              }
            />
            {formik.touched.requestDaForm && formik.errors.requestDaForm ? (
              <small className="text-danger">
                {formik.errors.requestDaForm}
              </small>
            ) : null}
          </Form.Group>
        </td>
        <td className="p-1" style={{ width: "15%" }}>
          <Form.Group>
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text>
                  {props.currency == "Euro" ? "€" : "$"}
                </InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                type="number"
                disabled={!props.editing}
                {...formik.getFieldProps("requestTotal")}
                isInvalid={
                  !!(formik.touched.requestTotal && formik.errors.requestTotal)
                }
                isValid={
                  formik.touched.requestTotal && !formik.errors.requestTotal
                }
              />
              {formik.touched.requestTotal && formik.errors.requestTotal ? (
                <small className="text-danger">
                  {formik.errors.requestTotal}
                </small>
              ) : null}
            </InputGroup>
          </Form.Group>
        </td>
        <td className="p-1">
          <span className="text-danger">
            <FaTimes
              title="Delete this line"
              className="mt-2"
              style={{
                cursor: "pointer",
                display: props.editing ? "inherit" : "none"
              }}
              onClick={() => {
                setModalOpen(true);
              }}
            />
          </span>
          <ConfirmationModal
            open={modalOpen}
            onHide={() => setModalOpen(false)}
            onConfirm={() => props.onDeleteClicked(props.item)}
            title="Delete Line"
            body="Are you sure you want to delete this line?"
            confirmText="Delete"
            cancelText="Cancel"
          />
        </td>
      </tr>
    </>
  );
};
