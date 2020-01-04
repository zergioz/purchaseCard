import React from "react";
import { DirectorateFilter } from "./DirectorateFilter";
import { StatusFilter } from "./StatusFilter";
import { FiscalYearFilter } from "./FiscalYearFilter";
import { Card } from "react-bootstrap";
import { ClearFiltersButton } from "./ClearFiltersButton";

export const FilterControls = () => {
  return (
    <>
      <div className="container-fluid grey">
        <div className="row">
          <div className="col-md-12">
            <small className="text-secondary">Filters</small>
            <Card>
              <Card.Body className="btn-group p-1">
                <DirectorateFilter />
                <FiscalYearFilter />
                <ClearFiltersButton />
              </Card.Body>
            </Card>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <StatusFilter />
          </div>
        </div>
      </div>
    </>
  );
};
