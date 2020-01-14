import React, { useState, useEffect, useReducer } from "react";
import { Request } from "../../services/models/Request";
import { Modal, Button, ButtonToolbar, Alert } from "react-bootstrap";
import { ApprovalAction } from "../../services/models/ApprovalAction";

interface IProps {
  request: Request;
  action: ApprovalAction;
  show: boolean;
  onExited: () => void;
  onActionFinalized: (action: ApprovalAction) => void;
}
export const ApprovalModal = (props: IProps) => {
  const [show, setShow] = useState(props.show);
  const [action, setAction] = useState(props.action);

  //show the modal
  useEffect(() => {
    setShow(props.show);
  }, [props.show]);

  //when the form inputs change, update the action
  const onApprovalFormInputsChanged = (inputs: any) => {
    console.log(`onApprovalFormInputsChanged`, inputs);
    setAction({ ...action, formInputs: inputs });
  };

  //when the save button is clicked, timestamp it and update the request
  //also lock the progress bar so they cant do any more actions
  const onActionButtonClicked = () => {
    console.log(`onActionButtonClicked`, action);
    action.date = new Date().toISOString();
    props.onActionFinalized(action);
    setShow(false);
  };

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
            {/* <Alert variant={props.action.bootstrapClass}> */}
            <Alert variant="danger">
              <b>
                Only use this function if you are trying to fix a request that
                is stuck!
              </b>
              <br />
              {props.action.description}
            </Alert>
            <props.action.form
              action={action}
              handleChange={onApprovalFormInputsChanged}
            />
          </Modal.Body>
          <Modal.Footer>
            <ButtonToolbar>
              <Button
                className="m-1"
                variant={props.action.bootstrapClass}
                onClick={onActionButtonClicked}
              >
                {props.action.verb}
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
