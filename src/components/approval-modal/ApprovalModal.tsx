import React, { useState, useEffect, useReducer } from "react";
import { Request } from "../../services/models/Request";
import { Modal, Button, ButtonToolbar, Alert } from "react-bootstrap";
import { ApprovalAction } from "../../services/models/ApprovalAction";
import { useByNameFormInputHandler } from "../approval-forms/FormInputHandler";

const requestApprovalReducer = (
  request: Request,
  action: ApprovalAction
): Request => {
  let nextRequest = request;
  console.log(`reducer`, action);
  switch (action.type) {
    case "sendto":
      nextRequest.status = action.formInputs["status"];
      break;
    case "approve":
      nextRequest.status = action.formInputs["status"];
      break;
    case "reject":
      nextRequest.status = action.formInputs["status"];
      break;
    default:
      console.log(`requestApprovalReducer: No action.`);
  }
  console.log(`nextRequest`, nextRequest);
  nextRequest.history.push(action);
  return nextRequest;
};

interface IProps {
  request: Request;
  action: ApprovalAction;
  show: boolean;
  onExited: () => void;
}
export const ApprovalModal = (props: IProps) => {
  const [show, setShow] = useState(props.show);
  const [state, dispatch] = useReducer(requestApprovalReducer, props.request);
  const [action, setAction] = useState(props.action);
  const {
    formInputs: formOutputs,
    handleChangeByName: handleChangeByName
  } = useByNameFormInputHandler(props.action.formInputs);

  //
  useEffect(() => {
    setAction({ ...action, formInputs: formOutputs });
  }, [formOutputs]);

  useEffect(() => {}, [state, props.request]);

  useEffect(() => {
    setShow(props.show);
  }, [props.show]);

  const onActionButtonClicked = () => {
    dispatch(action);
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
            <Alert variant={props.action.bootstrapClass}>
              {props.action.description}
            </Alert>
            <props.action.form
              action={action}
              handleChange={handleChangeByName}
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
