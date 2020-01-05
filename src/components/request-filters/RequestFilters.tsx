import React from "react";
import { DirectorateFilter } from "../filters/DirectorateFilter";
import { FiscalYearFilter } from "../filters/FiscalYearFilter";
import { Card, ButtonGroup } from "react-bootstrap";
import { ClearFiltersButton } from "../filters/ClearFiltersButton";
import { StatusFilterProgressBar } from "../filters/StatusFilterProgressBar";
import { StatusFilterTabs } from "../filters/StatusFilterTabs";
import Media from "react-media";
import { StatusFilter } from "../filters/StatusFilter";

interface IProps {
  hide?: string[];
}
export const RequestFilters = (props: IProps) => {
  const hidden = new Set(props.hide);
  const hideStatus = hidden.has("StatusFilter");
  const hideStatusFilterTabs = hidden.has("StatusFilterTabs");
  const hideStatusFilterProgressBar = hidden.has("StatusFilterProgressBar");
  const hideDirectorate = hidden.has("DirectorateFilter");
  const hideFiscalYear = hidden.has("FiscalYearFilter");

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
                      {!hideStatus && <StatusFilter />}
                      {!hideDirectorate && <DirectorateFilter />}
                      {!hideFiscalYear && <FiscalYearFilter />}
                      <ClearFiltersButton />
                    </ButtonGroup>
                  </Card.Body>
                </Card>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12">
                <br />
                {!hideStatusFilterTabs && matches.medium && (
                  <StatusFilterTabs />
                )}
                {!hideStatusFilterProgressBar && matches.large && (
                  <StatusFilterProgressBar />
                )}
              </div>
            </div>
          </div>
        )}
      </Media>
    </div>
  );
};
