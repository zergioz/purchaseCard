import React, { useState } from "react";
import { SendToModal } from "../modal-send-to/SendToModal";
import { ApproveRejectModal } from "../modal-approve-reject/ApproveRejectModal";
import { Request } from "../../services/models/Request";
import { Dropdown, ButtonGroup, DropdownButton } from "react-bootstrap";

interface IProps {
  request: Request;
}
export const ApprovalActionsButton = (props: IProps) => {
  const [sendToModalVisible, setSendToModalVisible] = useState<boolean>(false);
  const [approveRejectModalVisible, setApproveRejectModalVisible] = useState<
    boolean
  >(false);
  const [modalAction, setModalAction] = useState<string>("");

  const onActionClicked = (action: string) => {
    switch (action) {
      case "approve":
        setModalAction("approve");
        setApproveRejectModalVisible(true);
        break;
      case "sendto":
        setSendToModalVisible(true);
        break;
      case "reject":
        setModalAction("reject");
        setApproveRejectModalVisible(true);
        break;
      default:
        return;
    }
  };

  return (
    <>
      <SendToModal
        request={props.request}
        show={sendToModalVisible}
        onExited={() => setSendToModalVisible(false)}
      />
      <ApproveRejectModal
        request={props.request}
        action={modalAction}
        show={approveRejectModalVisible}
        onExited={() => setApproveRejectModalVisible(false)}
      />
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
