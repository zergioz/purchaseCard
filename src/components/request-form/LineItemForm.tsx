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
  const [item, setItem] = useState<Detail>(props.item);
  const formik = useFormik({
    initialValues: {
      ...item
    },
    onSubmit: values => {}
    //validationSchema: new Detail().getValidationSchema()
  });

  //auto total the line
  useEffect(() => {
    formik.setFieldValue(
      "requestTotal",
      formik.values.requestCost * formik.values.requestQty
    );
  }, [formik.values.requestCost, formik.values.requestQty]);

  //call the outside onChange handler when user leaves any field
  //todo: use actual formik subform logic to do this
  const handleBlur = (e: any) => {
    console.log(e);
    props.onChange(new Detail(formik.values));
  };

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
              type="text"
              disabled={!props.editing}
              name="requestQty"
              id="requestQty"
              value={formik.values.requestQty.toString()}
              onChange={formik.handleChange}
              pattern="[0-9]*"
              onBlur={handleBlur}
            />
          </Form.Group>
        </td>
        <td className="p-1">
          <Form.Group>
            <Form.Control
              type="text"
              disabled={!props.editing}
              id="requestDesc"
              name="requestDesc"
              value={formik.values.requestDesc}
              onChange={formik.handleChange}
              onBlur={handleBlur}
              placeholder="Description"
            />
          </Form.Group>
        </td>
        <td className="p-1">
          <Form.Group>
            <Form.Control
              type="text"
              disabled={!props.editing}
              id="requestSrc"
              name="requestSrc"
              value={formik.values.requestSrc}
              onChange={formik.handleChange}
              onBlur={handleBlur}
              placeholder="Source"
            />
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
                type="text"
                pattern="[0-9]*"
                disabled={!props.editing}
                id="requestCost"
                name="requestCost"
                value={formik.values.requestCost.toString()}
                onChange={formik.handleChange}
                onBlur={handleBlur}
              />
            </InputGroup>
          </Form.Group>
        </td>
        <td className="text-center p-1" style={{ width: "5%" }}>
          <Form.Group>
            <Form.Check
              type="checkbox"
              disabled={!props.editing}
              checked={formik.values.requestDdForm === true ? true : false}
              id="requestDdForm"
              name="requestDdForm"
              onChange={formik.handleChange}
              onBlur={handleBlur}
            />
          </Form.Group>
        </td>
        <td className="text-center p-1" style={{ width: "5%" }}>
          <Form.Group>
            <Form.Check
              type="checkbox"
              disabled={!props.editing}
              checked={formik.values.requestDaForm === true ? true : false}
              id="requestDaForm"
              name="requestDaForm"
              onChange={formik.handleChange}
              onBlur={handleBlur}
            />
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
                disabled={true}
                id="requestTotal"
                name="requestTotal"
                value={formik.values.requestTotal.toString()}
                onChange={formik.handleChange}
                onBlur={handleBlur}
              />
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
