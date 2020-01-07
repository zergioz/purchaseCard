import React, { useContext } from "react";

import { Row, Col, Form } from "react-bootstrap";
import UserContext from "../../contexts/UserContext";
import { ApprovalAction } from "../../constants/ApprovalActions";
import { getStatusesByFriendlyName } from "../../constants/StepStatus";

interface IProps {
  action: ApprovalAction;
}
export const SimpleApprovalForm = (props: IProps) => {
  const choices = Object.keys(getStatusesByFriendlyName());
  const { user } = useContext(UserContext);
  return (
    <Form>
      <Row>
        <Col>
          <Form.Group controlId="ControlTextarea1">
            <Form.Label>Comments</Form.Label>
            <Form.Control as="textarea" rows={3} />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group controlId="formGroupEmail">
            <Form.Label>{props.action.actor}</Form.Label>
            <Form.Control disabled type="text" value={user!.Title} />
          </Form.Group>
        </Col>
      </Row>
    </Form>
  );
};
