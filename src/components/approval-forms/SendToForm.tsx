import React, { useContext, useEffect } from "react";
import { Row, Col, Form } from "react-bootstrap";
import UserContext from "../../contexts/UserContext";
import { ApprovalAction } from "../../constants/ApprovalActions";
import { getStatusesByFriendlyName } from "../../constants/StepStatus";

interface IProps {
  action: ApprovalAction;
  handleChange: (event: any) => void;
}
export const SendToForm = (props: IProps) => {
  const choices = Object.keys(getStatusesByFriendlyName());
  const { user } = useContext(UserContext);

  return (
    <Form>
      <Row>
        <Col>
          <Form.Group controlId="formGridState">
            <Form.Label>Choose a step</Form.Label>
            <Form.Control
              as="select"
              name="status"
              onChange={props.handleChange}
              value={props.action.formInputs.status}
            >
              {choices.map((choice, index) => {
                return (
                  <option key={choice} value={choice}>
                    {choice}
                  </option>
                );
              })}
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group controlId="ControlTextarea1">
            <Form.Label>Comments</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="comments"
              value={props.action.formInputs.comments}
              onChange={props.handleChange}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group controlId="user">
            <Form.Label>{props.action.actor}</Form.Label>
            <Form.Control
              disabled
              type="text"
              name="user"
              value={user!.Title}
            />
          </Form.Group>
        </Col>
      </Row>
    </Form>
  );
};
