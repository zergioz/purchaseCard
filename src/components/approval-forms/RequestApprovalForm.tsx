import React, { useContext, useEffect } from "react";
import { Row, Col, Form } from "react-bootstrap";
import UserContext from "../../contexts/UserContext";
import { ApprovalAction } from "../../services/models/ApprovalAction";
import { getStatusesByFriendlyName } from "../../constants/StepStatus";
import { useByNameFormInputHandler } from "./FormInputHandler";

interface IProps {
  action: ApprovalAction;
  handleChange: (event: any) => void;
}
export const RequestApprovalForm = (props: IProps) => {
  const choices = Object.keys(getStatusesByFriendlyName());
  const { user } = useContext(UserContext);
  const required = new Set(props.action.formInputsRequired);
  const {
    formInputs,
    setFormInputs,
    handleChangeByName
  } = useByNameFormInputHandler(props.action.formInputs);

  const handleChange = (e: any) => {
    handleChangeByName(e);
    if (props.handleChange) {
      props.handleChange(e);
    }
  };

  //when this form loads, put defaults into all the approval fields
  useEffect(() => {
    const inputs = formInputs;
    inputs["status"] = "Draft";
    inputs["comments"] = "";
    inputs["user"] = user;
    setFormInputs(inputs);
  }, []);

  return (
    <Form>
      {required.has("status") && (
        <Row>
          <Col>
            <Form.Group controlId="formGridState">
              <Form.Label>Choose a step</Form.Label>
              <Form.Control
                as="select"
                name="status"
                onChange={handleChange}
                value={formInputs["status"]}
              >
                {choices.map(choice => {
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
      )}
      {required.has("comments") && (
        <Row>
          <Col>
            <Form.Group controlId="ControlTextarea1">
              <Form.Label>Comments</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="comments"
                placeholder="Type your comments"
                value={formInputs["comments"]}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
      )}
      {required.has("user") && (
        <Row>
          <Col>
            <Form.Group controlId="user">
              <Form.Label>{props.action.actor}</Form.Label>
              <Form.Control disabled type="text" value={user!.Title} />
              <Form.Control
                hidden
                type="text"
                name="user"
                value={formInputs["user"]}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
      )}
    </Form>
  );
};
