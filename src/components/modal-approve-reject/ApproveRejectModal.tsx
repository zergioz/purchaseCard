import React, { useState, useEffect, useContext } from "react";
import { Request } from "../../services/models/Request";
import { getStatusesByFriendlyName } from "../../constants/StepStatus";
import {
  Modal,
  Row,
  Col,
  Form,
  Button,
  ButtonToolbar,
  Alert
} from "react-bootstrap";
import UserContext from "../../contexts/UserContext";

interface IProps {
  request: Request;
  action: string;
  show: boolean;
  onExited: () => void;
}
export const ApproveRejectModal = (props: IProps) => {
  const [show, setShow] = useState(props.show);
  const statuses = Object.keys(getStatusesByFriendlyName());
  const { user } = useContext(UserContext);

  const actionTitle =
    props.action.charAt(0).toUpperCase() + props.action.slice(1);

  useEffect(() => {
    setShow(props.show);
  }, [props.show]);

  return (
    <Modal
      centered
      size="lg"
      show={show}
      onHide={() => setShow(false)}
      onExited={() => props.onExited()}
      aria-labelledby="send-to-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title id="send-to-modal">{actionTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {props.action == "approve" && (
          <Alert variant="success">
            You are approving this request and sending it to the next step.
          </Alert>
        )}
        {props.action == "reject" && (
          <Alert variant="danger">
            You are rejecting this request and marking it as closed.
          </Alert>
        )}
        <Form>
          <Row>
            <Col>
              {" "}
              <Form.Group controlId="ControlTextarea1">
                <Form.Label>Comments</Form.Label>
                <Form.Control as="textarea" rows={3} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="formGroupEmail">
                <Form.Label>User</Form.Label>
                <Form.Control disabled type="text" value={user!.Title} />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <ButtonToolbar>
          <Button className="m-1" variant="primary">
            Sign
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
  );
};
