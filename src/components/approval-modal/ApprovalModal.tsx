import React, { useState, useEffect, useContext } from "react";
import { Request } from "../../services/models/Request";

import { Modal, Button, ButtonToolbar, Alert } from "react-bootstrap";
import UserContext from "../../contexts/UserContext";
import { ApprovalAction } from "../../constants/ApprovalActions";

interface IProps {
  request: Request;
  action?: ApprovalAction;
  show: boolean;
  onExited: () => void;
}
export const ApprovalModal = (props: IProps) => {
  const [show, setShow] = useState(props.show);
  const { user } = useContext(UserContext);

  useEffect(() => {
    setShow(props.show);
  }, [props.show]);

  return (
    <>
      {props.action && (
        <Modal
          centered
          size="lg"
          show={show}
          onHide={() => setShow(false)}
          onExited={() => props.onExited()}
          aria-labelledby="send-to-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title id="send-to-modal">{props.action.action}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Alert variant={props.action.bootstrapClass}>
              {props.action.description}
            </Alert>
            <props.action.form action={props.action} />
          </Modal.Body>
          <Modal.Footer>
            <ButtonToolbar>
              <Button className="m-1" variant="primary">
                {props.action.action}
              </Button>
              <Button
                className="m-1"
                variant="outline-secondary"
                onClick={() => setShow(false)}
              >
                Cancel
              </Button>
            </ButtonToolbar>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};
