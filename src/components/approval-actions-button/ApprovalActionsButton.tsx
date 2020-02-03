import React, { useState, useReducer, useEffect, useContext } from "react";
import { ApprovalModal } from "../approval-modal/ApprovalModal";
import { Request } from "../../services/models/Request";
import { Dropdown, ButtonGroup, Spinner } from "react-bootstrap";
import {
  ApprovalAction,
  IApprovalAction,
  BootstrapButtonVariant
} from "../../services/models/ApprovalAction";
import { ApprovalReducer } from "../../reducers/ApprovalReducer";
import { ApprovalActions } from "../../constants/ApprovalActions";
import { RequestService } from "../../services";
import { useToasts } from "react-toast-notifications";
import { Link, useHistory } from "react-router-dom";
import { EmailService } from "../../services/EmailService";
import RoleContext from "../../contexts/RoleContext";

interface IProps {
  request: Request;
  variant: BootstrapButtonVariant;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  hidden?: boolean;
  actions: Set<string>;
  onRequestUpdated: (newRequest: Request) => void;
  onBeforeAction: (action: ApprovalAction) => boolean;
}
export const ApprovalActionsButton = (props: IProps) => {
  const svc = new RequestService();
  const emailSvc = new EmailService();
  const { roles } = useContext(RoleContext);
  const [loading, setLoading] = useState<boolean>(!!props.loading);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalAction, setModalAction] = useState<ApprovalAction | null>(null);
  const [nextRequestState, dispatchApprovalAction] = useReducer(
    ApprovalReducer,
    props.request
  );

  const { addToast } = useToasts();
  const history = useHistory();

  //fires only after the reducer updates the state of the request
  useEffect(() => {
    if (props.request.status !== nextRequestState.status) {
      emailSvc.notifyNextApproversFor(nextRequestState, roles);
      emailSvc.notifySubmitterFor(nextRequestState);
      props.onRequestUpdated(nextRequestState);
    }
  }, [nextRequestState.status]);

  //update loading state if props change
  useEffect(() => {
    setLoading(!!props.loading);
  }, [props.loading]);

  //show the modal with the form specific to this action
  const onActionClicked = (action: string) => {
    const approvalAction: IApprovalAction = ApprovalActions[action];
    const actionIsAllowed = props.onBeforeAction(approvalAction);
    if (actionIsAllowed) {
      setModalAction(approvalAction);
      setModalVisible(true);
    }
  };

  //they closed the modal by hitting save, so dispatch the action
  //and notify the parent component
  const onActionFinalized = (action: ApprovalAction) => {
    if (action.type == "clone") {
      cloneRequest();
    } else if (action.type == "delete") {
      deleteRequest();
    } else {
      dispatchApprovalAction(action);
    }
  };

  const deleteRequest = () => {
    setLoading(true);
    addToast("Deleting...", {
      appearance: "info",
      autoDismiss: true
    });
    svc.delete(props.request).subscribe(
      () => {
        setLoading(false);
        addToast("Deleted!", {
          appearance: "success",
          autoDismiss: true
        });
        history.push("/requests");
      },
      error => {
        setLoading(false);
        addToast("Delete failed", {
          appearance: "error",
          autoDismiss: false
        });
        console.error("Error during delete", error);
      }
    );
  };

  const cloneRequest = () => {
    setLoading(true);
    addToast("Cloning...", {
      appearance: "info",
      autoDismiss: true
    });
    svc.clone(props.request).subscribe(
      clone => {
        setLoading(false);
        addToast(
          <div>
            Cloned into{" "}
            <Link to={`/requests/details/${clone.id}/reload`}>
              Request #{clone.id}
            </Link>
          </div>,
          {
            appearance: "success",
            autoDismiss: false
          }
        );
      },
      error => {
        setLoading(false);
        addToast("Clone failed", {
          appearance: "error",
          autoDismiss: false
        });
        console.error("Error during clone", error);
      }
    );
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
          {loading && (
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
          <Dropdown.Item
            hidden={!props.actions.has("submit")}
            onClick={() => onActionClicked("submit")}
          >
            Submit
          </Dropdown.Item>
          <Dropdown.Item
            hidden={!props.actions.has("approve")}
            onClick={() => onActionClicked("approve")}
          >
            Approve &amp; Sign
          </Dropdown.Item>
          <Dropdown.Item
            hidden={!props.actions.has("sendto")}
            onClick={() => onActionClicked("sendto")}
          >
            Send to...
          </Dropdown.Item>
          <Dropdown.Item
            hidden={!props.actions.has("reject")}
            onClick={() => onActionClicked("reject")}
          >
            Reject &amp; Close
          </Dropdown.Item>
          <Dropdown.Divider hidden={props.actions.size == 1} />
          <Dropdown.Item
            hidden={!props.actions.has("delete")}
            onClick={() => onActionClicked("delete")}
          >
            Delete
          </Dropdown.Item>
          <Dropdown.Item
            hidden={!props.actions.has("clone")}
            onClick={() => onActionClicked("clone")}
          >
            Clone
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};
