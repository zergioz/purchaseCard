import React, { useState, useReducer } from "react";
import { ApprovalModal } from "../approval-modal/ApprovalModal";
import { Request } from "../../services/models/Request";
import { Dropdown, ButtonGroup, DropdownButton } from "react-bootstrap";
import {
  ApprovalAction,
  IApprovalAction
} from "../../services/models/ApprovalAction";
import { ApprovalReducer } from "../../reducers/ApprovalReducer";
import { ApprovalActions } from "../../constants/ApprovalActions";

interface IProps {
  request: Request;
  onRequestUpdated: (oldRequest: Request, newRequest: Request) => void;
}
export const ApprovalActionsButton = (props: IProps) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalAction, setModalAction] = useState<ApprovalAction | null>(null);
  const [nextRequestState, dispatchApprovalAction] = useReducer(
    ApprovalReducer,
    props.request
  );

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
    props.onRequestUpdated(props.request, nextRequestState);
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
      <Dropdown as={ButtonGroup} size="sm" className="mt-2">
        <DropdownButton
          variant="warning"
          size="sm"
          title="Actions"
          id="approval-button"
        >
          <Dropdown.Item onClick={() => onActionClicked("approve")}>
            Approve
          </Dropdown.Item>
          <Dropdown.Item onClick={() => onActionClicked("sendto")}>
            Send to...
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={() => onActionClicked("reject")}>
            Reject
          </Dropdown.Item>
        </DropdownButton>
      </Dropdown>
    </>
  );
};
