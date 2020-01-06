import React from "react";
import { DirectorateFilter } from "../request-filters/DirectorateFilter";
import { FiscalYearFilter } from "../request-filters/FiscalYearFilter";
import { Card, ButtonGroup } from "react-bootstrap";
import { ClearFiltersButton } from "../filters/ClearFiltersButton";
import { StatusFilterProgressBar } from "../request-filters/StatusFilterProgressBar";
import { StatusFilterTabs } from "../request-filters/StatusFilterTabs";
import Media from "react-media";
import { StatusFilter } from "../request-filters/StatusFilter";
import { KeywordFilter } from "../request-filters/KeywordFilter";
import { RequestTypeFilter } from "../request-filters/RequestTypeFilter";

interface IProps {
  hide?: string[];
}
export const RequestFiltersContainer = (props: IProps) => {
  const hidden = new Set(props.hide);
  const hideStatus = hidden.has("StatusFilter");
  const hideStatusFilterTabs = hidden.has("StatusFilterTabs");
  const hideStatusFilterProgressBar = hidden.has("StatusFilterProgressBar");
  const hideDirectorate = hidden.has("DirectorateFilter");
  const hideRequestType = hidden.has("RequestTypeFilter");
  const hideFiscalYear = hidden.has("FiscalYearFilter");
  const hideCard = hidden.has("Card");

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
              <div className="col">
                <small className="text-secondary">Search</small>
                <KeywordFilter />
              </div>
              {!hideCard && (
                <div className="col-md-6">
                  <small className="text-secondary">Filters</small>
                  <Card>
                    <Card.Body className="p-1">
                      <ButtonGroup vertical={matches.small}>
                        {!hideStatus && <StatusFilter />}
                        {!hideDirectorate && <DirectorateFilter />}
                        {!hideRequestType && <RequestTypeFilter />}
                        {!hideFiscalYear && <FiscalYearFilter />}
                        <ClearFiltersButton />
                      </ButtonGroup>
                    </Card.Body>
                  </Card>
                </div>
              )}
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
