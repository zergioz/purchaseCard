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

  const StatusFilterProgressStepIcon = (props: any) => {
    return (
      <div
        style={{ cursor: "pointer" }}
        className={`progress-step ${
          selectedIndex >= props.index ? "accomplished" : ""
        } ${selectedIndex == props.index ? "current" : ""}`}
        onClick={() => setSelected(props.value)}
      >
        {props.index + 1}
      </div>
    );
  };

  const StatusFilterProgressStep = (props: any) => {
    return (
      <Nav.Link
        onClick={() => setSelected(props.value)}
        eventKey={props.value}
        active={props.value == selected}
      >
        <span className="nowrap" style={{ whiteSpace: "pre" }}>
          {props.value}
        </span>
        <p className="text-secondary">
          {" "}
          <Badge variant={!!badges[props.index] ? badgeStyle : "light"}>
            {badges[props.index]}
          </Badge>{" "}
          {badges[props.index] == 1 ? "item" : "items"}
        </p>
      </Nav.Link>
    );
  };

  return (
    <>
      <div className="container-fluid-spacious">
        <div className="row">
          {statuses.map((value: string, index: number) => (
            <div className="col-1 d-flex justify-content-center">
              <StatusFilterProgressStepIcon index={index} value={value} />
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
              <StatusFilterProgressStep index={index} value={value} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
