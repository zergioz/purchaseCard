import React, { useState, useReducer, useEffect } from "react";
import { ApprovalModal } from "../approval-modal/ApprovalModal";
import { Request } from "../../services/models/Request";
import { Dropdown, ButtonGroup, Spinner, Badge } from "react-bootstrap";
import {
  ApprovalAction,
  IApprovalAction,
  BootstrapButtonVariant
} from "../../services/models/ApprovalAction";
import { ApprovalReducer } from "../../reducers/ApprovalReducer";
import { ApprovalActions } from "../../constants/ApprovalActions";

interface IProps {
  request: Request;
  variant: BootstrapButtonVariant;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  hidden?: boolean;
  onRequestUpdated: (newRequest: Request) => void;
}
export const ApprovalActionsButton = (props: IProps) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalAction, setModalAction] = useState<ApprovalAction | null>(null);
  const [nextRequestState, dispatchApprovalAction] = useReducer(
    ApprovalReducer,
    props.request
  );

  //fires only after the reducer updates the state of the request
  useEffect(() => {
    if (props.request.status !== nextRequestState.status) {
      props.onRequestUpdated(nextRequestState);
    }
  }, [nextRequestState.status]);

  //show the modal with the form specific to this action
  const onActionClicked = (action: string) => {
    const approvalAction: IApprovalAction = ApprovalActions[action];
    setModalAction(approvalAction);
    setModalVisible(true);
  };

  //they closed the modal by hitting save, so dispatch the action
  //and notify the parent component
  const onActionFinalized = (action: ApprovalAction) => {
    console.log("onActionFinalized", action);
    dispatchApprovalAction(action);
  };

  //modal closed, reset things for next use
  const onExited = () => {
    setModalVisible(false);
    setModalAction(null);
  };

  return (
    <>
      {modalAction && (
        <ApprovalModal
          request={props.request}
          action={modalAction}
          show={modalVisible}
          onExited={onExited}
          onActionFinalized={onActionFinalized}
        />
      )}
      <Dropdown as={ButtonGroup} size="sm" className={`${props.className}`}>
        <Dropdown.Toggle
          hidden={props.hidden}
          disabled={props.disabled}
          variant={props.variant}
          size="sm"
          id="approval-button"
        >
          {props.loading && (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          )}{" "}
          Actions
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => onActionClicked("approve")}>
            Approve &amp; Sign
          </Dropdown.Item>
          <Dropdown.Item onClick={() => onActionClicked("sendto")}>
            Send to...
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={() => onActionClicked("reject")}>
            Reject &amp; Close
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};
