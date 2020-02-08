import React from "react";
import { Modal, Button, Alert } from "react-bootstrap";

interface IProps {
  show: boolean;
  onHide: () => void;
}
export const ValidationErrorModal = (props: IProps) => {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Couldn't Save
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Alert variant="danger">
          There are problems with the data you've entered.
        </Alert>
        <p className="pl-3">
          Please correct the errors and try saving the form again.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};
