import React, { useState, useEffect } from "react";
import { ProgressBar } from "react-bootstrap";
import "./ApprovalProgressBar.css";
import { getStatusesByFriendlyName } from "../../../constants/StepStatus";
import { useApprovalBadges } from "../../../components/approval-badge/ApprovalBadges";
import { Request } from "../../../services/models/Request";
import { ApprovalActionsButton } from "../../../components/approval/ApprovalActionsButton";

interface IProps {
  request: Request;
}
export const ApprovalProgressBar = (props: IProps) => {
  const statuses: string[] = Object.keys(getStatusesByFriendlyName());
  const [selected, setSelected] = useState<string>(props.request.status || "");
  const [selectedIndex, setSelectedIndex] = useState<number>(
    statuses.indexOf(props.request.status || "")
  );

  const badges = useApprovalBadges(props.request, "auto", false);

  useEffect(() => {
    if (props.request.status) setSelected(props.request.status);
  }, [props.request]);

  useEffect(() => {
    let index = statuses.indexOf(selected);
    //blank filter isn't in the list
    index = index == -1 ? 0 : index;
    setSelectedIndex(index);
  }, [selected]);

  const ApprovalProgressStepIcon = (props: any) => {
    return (
      <div
        className={`progress-step ${
          selectedIndex >= props.index ? "accomplished" : ""
        } ${selectedIndex == props.index ? "current" : ""}`}
      >
        {props.index + 1}
      </div>
    );
  };

  const ApprovalProgressStep = (props: any) => {
    const activeStyle = {
      opacity: props.active ? "100%" : "70%",
      fontWeight: props.active ? 600 : 500
    };

    return (
      <>
        <p className="nowrap" style={{ ...activeStyle, whiteSpace: "pre" }}>
          {props.value}
        </p>
        <div className="mt-n3" style={activeStyle}>
          {props.active && <ApprovalActionsButton request={props.request} />}
          {!props.active && badges[props.index]}
        </div>
      </>
    );
  };

  return (
    <>
      <div className="container-fluid-spacious">
        <div className="row">
          {statuses.map((value: string, index: number) => (
            <div
              className="col-1 d-flex justify-content-center"
              key={`step-icon-${index}-${value}`}
            >
              <ApprovalProgressStepIcon index={index} value={value} />
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
            <div
              className="col-1 text-center pt-3"
              key={`step-${index}-${value}`}
            >
              <ApprovalProgressStep
                index={index}
                value={value}
                active={value == props.request.status}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
