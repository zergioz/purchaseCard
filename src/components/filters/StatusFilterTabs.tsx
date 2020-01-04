import React, { useState, useContext, useEffect } from "react";
import { Badge, Nav } from "react-bootstrap";
import RequestContext from "../../contexts/RequestContext";
import {
  getStatusesByFriendlyName,
  groupByStatus
} from "../../constants/StepStatus";

const statuses: string[] = Object.keys(getStatusesByFriendlyName());

export const StatusFilterTabs: React.FC = () => {
  const context = useContext(RequestContext);
  const [badges, setBadges] = useState<number[]>([]);
  const [selected, setSelected] = useState<string>(context.filters.status);

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
  }, [context.filters]);

  //if the state of this component changes, then apply the filters
  useEffect(() => {
    if (context.filters.status !== selected) {
      context.applyFilters({ ...context.filters, status: selected }, true);
    }
  }, [selected]);

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
