import React, { useState, useEffect } from "react";
import {
  ProgressBar,
  ButtonGroup,
  Dropdown,
  DropdownButton
} from "react-bootstrap";
import "./ApprovalProgressBar.css";
import { getStatusesByFriendlyName } from "../../../constants/StepStatus";
import { useApprovalBadges } from "../../../components/approval-badge/ApprovalBadges";
import { Request } from "../../../services/models/Request";

interface IProps {
  request: Request;
}
export const ApprovalProgressBar = (props: IProps) => {
  const statuses: string[] = Object.keys(getStatusesByFriendlyName());
  const [selected, setSelected] = useState<string>(props.request.status || "");
  const [selectedIndex, setSelectedIndex] = useState<number>(
    statuses.indexOf(props.request.status || "")
  );

  const badges = useApprovalBadges(props.request, false);

  useEffect(() => {
    let index = statuses.indexOf(selected);
    //blank filter isn't in the list
    index = index == -1 ? 0 : index;
    setSelectedIndex(index);
  }, [selected]);

  const StatusFilterProgressStepIcon = (props: any) => {
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

  const StatusFilterProgressStep = (props: any) => {
    let actionElement = null;
    if (props.active) {
      actionElement = (
        <Dropdown as={ButtonGroup} size="sm" className="mt-2">
          <DropdownButton
            variant="danger"
            size="sm"
            title="Actions"
            id="approval-button"
          >
            <Dropdown.Item href="#/action-1">Sign</Dropdown.Item>
            <Dropdown.Item href="#/action-2">Send to...</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item href="#/action-2">Reject</Dropdown.Item>
          </DropdownButton>
        </Dropdown>
      );
    } else {
      actionElement = badges[props.index];
    }
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
          {actionElement}
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
            <div
              className="col-1 text-center pt-3"
              key={`step-${index}-${value}`}
            >
              <StatusFilterProgressStep
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
