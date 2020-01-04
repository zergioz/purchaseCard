import React, { useState, useContext, useEffect } from "react";
import RequestContext from "../../contexts/RequestContext";
import {
  getStatusesByFriendlyName,
  groupByStatus
} from "../../constants/StepStatus";
import { ProgressBar, Nav, Badge } from "react-bootstrap";
import "./StatusFilterProgressBar.css";

const statuses = Object.keys(getStatusesByFriendlyName());

export const StatusFilterProgressBar = () => {
  const context = useContext(RequestContext);
  const [badges, setBadges] = useState<number[]>([]);
  const [selected, setSelected] = useState<string>(context.filters.status);
  const [selectedIndex, setSelectedIndex] = useState<number>(
    statuses.indexOf(context.filters.status)
  );

  //when other filters are applied, recalculate the badges we should be showing in this component
  useEffect(() => {
    //todo: skip this calculation if only the status filter changed
    const allOtherFilters = { ...context.filters, status: "" };
    const matches = context.applyFilters(allOtherFilters, false);
    const counts = groupByStatus(matches);
    setBadges(counts);
  }, [context.filters]);

  //if the status filter changes, update our state
  useEffect(() => {
    setSelected(context.filters.status);
    setSelectedIndex(statuses.indexOf(context.filters.status));
  }, [context.filters]);

  //if the state of this component changes, then apply the filters
  useEffect(() => {
    if (context.filters.status !== selected) {
      context.applyFilters({ ...context.filters, status: selected }, true);
    }
  }, [selected]);

  const badgeStyle = "danger";

  return (
    <>
      <div className="container-fluid-spacious">
        <div className="row">
          {statuses.map((value: string, index: number) => (
            <div className="col-1 d-flex justify-content-center">
              <div
                style={{ cursor: "pointer" }}
                className={`progress-step ${
                  selectedIndex >= index ? "accomplished" : ""
                } ${selectedIndex == index ? "current" : ""}`}
                onClick={() => setSelected(value)}
              >
                {index + 1}
              </div>
            </div>
          ))}
        </div>
        <div className="row">
          <div className="col-md-12">
            <div style={{ marginLeft: "4%", marginRight: "4%" }}>
              <ProgressBar
                min={0}
                max={statuses.length - 1}
                now={selectedIndex}
              ></ProgressBar>
            </div>
          </div>
        </div>
        <div className="row">
          {statuses.map((value: string, index: number) => (
            <div className="col-1 text-center">
              <Nav.Link
                onClick={() => setSelected(value)}
                eventKey={value}
                active={value == selected}
              >
                <span className="nowrap" style={{ whiteSpace: "pre" }}>
                  {value}
                </span>
                <p className="text-secondary">
                  {" "}
                  <Badge variant={!!badges[index] ? badgeStyle : "light"}>
                    {badges[index]}
                  </Badge>{" "}
                  items
                </p>
              </Nav.Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
