import React, { useContext } from "react";

import { Row, Col, Form } from "react-bootstrap";
import UserContext from "../../contexts/UserContext";
import { ApprovalAction } from "../../constants/ApprovalActions";

interface IProps {
  action: ApprovalAction;
  handleChange: (event: any) => void;
}
export const SimpleApprovalForm = (props: IProps) => {
  const { user } = useContext(UserContext);
  return (
    <Form>
      <Row>
        <Col>
          <Form.Group controlId="comments">
            <Form.Label>Comments</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="comments"
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
              value={user!.Title}
              name="user"
              onChange={props.handleChange}
            />
          </Form.Group>
        </Col>
      </Row>
    </Form>
  );
};
