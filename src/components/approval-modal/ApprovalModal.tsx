import React, { useState, useEffect, useReducer } from "react";
import { Request } from "../../services/models/Request";
import { Modal, Button, ButtonToolbar, Alert } from "react-bootstrap";
import { ApprovalAction } from "../../services/models/ApprovalAction";
import { getNextStatus } from "../../constants/StepStatus";

const requestApprovalReducer = (
  request: Request,
  action: ApprovalAction
): Request => {
  let nextRequest = request;
  console.log(`reducer`, action);
  switch (action.type) {
    case "sendto":
      nextRequest.status = action.formInputs["status"];
      console.log("sendto", nextRequest.status);
      break;
    case "approve":
      nextRequest.status = getNextStatus(request);
      console.log("approve", nextRequest.status);
      break;
    case "reject":
      nextRequest.status = "Closed";
      console.log("reject", nextRequest.status);
      break;
    default:
      console.log(`requestApprovalReducer: No action.`);
  }
  console.log(`nextRequest`, nextRequest);
  if (nextRequest.history) nextRequest.history.push(action);
  return nextRequest;
};

interface IProps {
  request: Request;
  action: ApprovalAction;
  show: boolean;
  onExited: () => void;
  onRequestUpdated: (oldRequest: Request, newRequest: Request) => void;
}
export const ApprovalModal = (props: IProps) => {
  const [request, setRequest] = useState(props.request);
  const [show, setShow] = useState(props.show);
  const [nextRequest, dispatch] = useReducer(
    requestApprovalReducer,
    props.request
  );
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
    action.date = new Date();
    dispatch(action);
    setShow(false);
  };

  //request changes status after an action is dispatched - send the change up
  useEffect(() => {
    console.log(
      `nextRequest changed`,
      nextRequest.status,
      props.request.status,
      request.status
    );
    if (nextRequest.status != request.status) {
      props.onRequestUpdated(request, nextRequest);
    }
  }, [nextRequest]);

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
