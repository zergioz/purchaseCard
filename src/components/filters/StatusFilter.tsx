import React, { useState, useContext, useEffect } from "react";
import { Badge, Nav } from "react-bootstrap";
import RequestContext from "../../contexts/RequestContext";
import {
  getStatusesByFriendlyName,
  groupByStatus
} from "../../constants/StepStatus";

const statuses: string[] = Object.keys(getStatusesByFriendlyName());

interface IProps {
  selected?: string;
}
export const StatusFilter: React.FC<IProps> = props => {
  const context = useContext(RequestContext);
  const [badges, setBadges] = useState<number[]>([]);
  const [selected, setSelected] = useState<string>(
    props.selected || "Submitted"
  );

  //when other filters are applied, recalculate the badges we should be showing in this component
  useEffect(() => {
    //todo: skip this calculation if only the status filter changed
    const allOtherFilters = { ...context.filters, status: "" };
    const matches = context.applyFilters(allOtherFilters, false);
    const counts = groupByStatus(matches);
    setBadges(counts);
  }, [context.filters]);

  //if the status filter route changes, update our state
  useEffect(() => {
    if (props.selected) {
      const status = props.selected;
      setSelected(status);
    }
  }, [props.selected]);

  //if the state of this component changes, then apply the filters
  useEffect(() => {
    context.applyFilters({ ...context.filters, status: selected }, true);
  }, [selected, context.requests]);

  const badgeStyle = "danger";

  return (
    <div className="grey">
      <br />
      <Nav fill variant="tabs" defaultActiveKey={selected}>
        {statuses.map((value: string, index: number) => (
          <Nav.Item key={`selector-${value}-${index}`}>
            <Nav.Link
              onClick={() => setSelected(value)}
              eventKey={value}
              active={value == selected}
            >
              {value}{" "}
              <Badge variant={!!badges[index] ? badgeStyle : "light"}>
                {badges[index]}
              </Badge>
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
    </div>
  );
};
