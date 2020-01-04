import React from "react";
import { DirectorateFilter } from "./DirectorateFilter";
import { FiscalYearFilter } from "./FiscalYearFilter";
import { Card, ButtonGroup } from "react-bootstrap";
import { ClearFiltersButton } from "./ClearFiltersButton";
import { StatusFilterProgressBar } from "./StatusFilterProgressBar";
import { StatusFilterTabs } from "./StatusFilterTabs";
import Media from "react-media";
import { StatusFilter } from "./StatusFilter";

export const FilterControls = () => {
  return (
    <div className="bg-light" style={{ border: "1px solid #ccc" }}>
      <Media
        queries={{
          small: "(max-width: 599px)",
          medium: "(min-width: 600px) and (max-width: 1199px)",
          large: "(min-width: 1200px)"
        }}
      >
        {(matches: any) => (
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12">
                <small className="text-secondary">Filters</small>
                <Card>
                  <Card.Body className="p-1">
                    <ButtonGroup vertical={matches.small}>
                      <StatusFilter />
                      <DirectorateFilter />
                      <FiscalYearFilter />
                      <ClearFiltersButton />
                    </ButtonGroup>
                  </Card.Body>
                </Card>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12">
                <br />
                {matches.medium && <StatusFilterTabs />}
                {matches.large && <StatusFilterProgressBar />}
              </div>
            </div>
          </div>
        )}
      </Media>
    </div>
  );
};
