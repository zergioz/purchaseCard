import React from "react";
import { Spinner, Container, Row, Col } from "react-bootstrap";
export const LoadingResults = () => {
  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <div className="d-flex justify-content-center mt-5">
            <Spinner animation="border" role="status" variant="secondary">
              <span className="sr-only">Loading...</span>
            </Spinner>
          </div>
        </Col>
      </Row>
    </Container>
  );
};
