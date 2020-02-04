import React from "react";
import { Modal, Button } from "react-bootstrap";

interface IProps {
  onConfirm: () => void;
  body: string;
  confirmText: string;
  cancelText: string;
  title: string;
  open: boolean;
  onHide: () => void;
  size?: "sm" | "lg" | "xl";
}
export const ConfirmationModal = (props: IProps) => {
  const onConfirm = () => {
    props.onConfirm();
    props.onHide();
  };

  return (
    <Modal
      show={props.open}
      onHide={props.onHide}
      size={props.size ? props.size : "sm"}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>{props.body}</p>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="outline-secondary" onClick={() => props.onHide()}>
          {props.cancelText}
        </Button>
        <Button variant="primary" onClick={() => onConfirm()}>
          {props.confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
