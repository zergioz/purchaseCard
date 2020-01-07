import React, { useState, useEffect, useContext } from "react";
import {
  Modal,
  Row,
  Col,
  Form,
  Alert,
  Button,
  ButtonToolbar
} from "react-bootstrap";
import { Request } from "../../services/models/Request";
import { getStatusesByFriendlyName } from "../../constants/StepStatus";
import UserContext from "../../contexts/UserContext";

interface IProps {
  request: Request;
  show: boolean;
  onExited: () => void;
}
export const SendToModal = (props: IProps) => {
  const [show, setShow] = useState(props.show);
  const choices = Object.keys(getStatusesByFriendlyName());
  const { user } = useContext(UserContext);

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
        <Modal.Title id="send-to-modal">Send To</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Alert variant="info">
          You are sending this request to another step without signing it.
        </Alert>
        <Form>
          <Row>
            <Col>
              <Form.Group controlId="formGridState">
                <Form.Label>Choose a step</Form.Label>
                <Form.Control as="select">
                  {choices.map(choice => {
                    return <option key={choice}>{choice}</option>;
                  })}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
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
            Send
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
