import React from "react";
import { Container, Row, Col, Alert } from "react-bootstrap";
import { ClearFiltersButton } from "../filters/ClearFiltersButton";

export const NoResults = () => {
  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <Alert variant="success">
            <div className="d-flex justify-content-center">
              <span className="mt-2 mr-2">There are no requests here.</span>
              <ClearFiltersButton />
            </div>
          </Alert>
        </Col>
      </Row>
    </Container>
  );
};
