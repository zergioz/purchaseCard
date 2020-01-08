import React, { useState } from "react";
import { ApprovalModal } from "../approval-modal/ApprovalModal";
import { Request } from "../../services/models/Request";
import { Dropdown, ButtonGroup, DropdownButton } from "react-bootstrap";
import { ApprovalActions } from "../../constants/ApprovalActions";
import { ApprovalAction } from "../../services/models/ApprovalAction";

interface IProps {
  request: Request;
}
export const ApprovalActionsButton = (props: IProps) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalAction, setModalAction] = useState<ApprovalAction | null>(null);

  const onActionClicked = (action: string) => {
    const approvalAction = ApprovalActions[action];
    setModalAction(approvalAction);
    setModalVisible(true);
  };

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
        />
      )}
      <Dropdown as={ButtonGroup} size="sm" className="mt-2">
        <DropdownButton
          variant="danger"
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
