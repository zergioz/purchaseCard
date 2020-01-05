import React, { useState, useEffect } from "react";
import { ProgressBar, Nav, Badge } from "react-bootstrap";
import "./StatusFilterProgressBar.css";
import { useStatusFilter } from "./StatusFilter";

export const StatusFilterProgressBar = () => {
  const { badges, statuses, selected, setSelected } = useStatusFilter();
  const [selectedIndex, setSelectedIndex] = useState<number>(
    statuses.indexOf(selected)
  );

  //if the status filter changes, update our state
  useEffect(() => {
    let index = statuses.indexOf(selected);
    //blank filter isn't in the list
    index = index == -1 ? 0 : index;
    setSelectedIndex(index);
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
