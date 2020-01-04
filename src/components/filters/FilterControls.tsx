import React from "react";
import { DirectorateFilter } from "./DirectorateFilter";
import { FiscalYearFilter } from "./FiscalYearFilter";
import { Card } from "react-bootstrap";
import { ClearFiltersButton } from "./ClearFiltersButton";
import { StatusFilterProgressBar } from "./StatusFilterProgressBar";
import { StatusFilter } from "./StatusFilter";
import Media from "react-media";

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
          <div className="col-lg-12">
            <br />
            <Media
              queries={{
                small: "(max-width: 599px)",
                medium: "(min-width: 600px) and (max-width: 1199px)",
                large: "(min-width: 1200px)"
              }}
            >
              {(matches: any) => (
                <>
                  {matches.small && <StatusFilter />}
                  {matches.medium && <StatusFilter />}
                  {matches.large && <StatusFilterProgressBar />}
                </>
              )}
            </Media>
          </div>
        </div>
      </div>
    </>
  );
};
