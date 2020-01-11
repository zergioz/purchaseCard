import React, { useState, useEffect } from "react";
import { ProgressBar } from "react-bootstrap";
import "./ApprovalProgressBar.css";
import { getStatusesByFriendlyName } from "../../constants/StepStatus";
import { useActionBadges } from "../approval-action-badge/ApprovalActionBadgeBar";
import { Request } from "../../services/models/Request";
import { ApprovalActionsButton } from "../approval-actions-button/ApprovalActionsButton";

interface IProps {
  locked: boolean;
  request: Request;
  onRequestUpdated: (oldRequest: Request, newRequest: Request) => void;
}
export const ApprovalProgressBar = (props: IProps) => {
  const statuses: string[] = Object.keys(getStatusesByFriendlyName());
  const [request, setRequest] = useState<Request>(props.request);
  const [locked, setLocked] = useState(props.locked);
  const [selected, setSelected] = useState(request.status);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const badges = useActionBadges(request, "auto", false);

  //when the request status changes, tell the progress bar where to go
  useEffect(() => {
    if (selected) {
      let index = statuses.indexOf(selected);

      //blank filter isn't in the list
      index = index == -1 ? 0 : index;
      setSelectedIndex(index);
    }
  }, [selected]);

  const onRequestUpdated = (oldRequest: Request, newRequest: Request) => {
    console.log("Request updated", newRequest);
    setRequest(newRequest);
    setSelected(newRequest.status);
    setLocked(true);
    if (props.onRequestUpdated) {
      props.onRequestUpdated(oldRequest, newRequest);
    }
  };

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

  interface IApprovalProgressStepProps {
    index: number;
    value: string;
    active: boolean;
    request: Request;
    locked: boolean;
  }
  const ApprovalProgressStep = (props: IApprovalProgressStepProps) => {
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
          {props.active && !props.locked && (
            <ApprovalActionsButton
              variant="danger"
              request={request}
              onRequestUpdated={onRequestUpdated}
            />
          )}
          {(!props.active || props.locked) && badges[props.index]}
        </div>
      </>
    );
  };

  return (
    <>
      {request && (
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
                  active={value == request.status}
                  request={request}
                  locked={locked}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
