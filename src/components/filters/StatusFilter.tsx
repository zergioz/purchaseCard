import React, { useState, useContext, useEffect } from "react";
import { Badge, Nav } from "react-bootstrap";
import RequestContext from "../../contexts/RequestContext";
import {
  getStatusesByFriendlyName,
  groupByStatus
} from "../../constants/StepStatus";
import { Request } from "../../services/models/Request";

const statuses: string[] = Object.keys(getStatusesByFriendlyName());

interface IProps {
  selected?: string;
  showBadgesFor: Request[];
}
export const StatusFilter: React.FC<IProps> = props => {
  const context = useContext(RequestContext);
  const [badges, setBadges] = useState<number[]>([]);
  const [selected, setSelected] = useState<string>(
    props.selected || "Submitted"
  );

  //recreate the request count badges if the props are updated
  useEffect(() => {
    const counts = groupByStatus(props.showBadgesFor);
    setBadges(counts);
  }, [props.showBadgesFor]);

  //if the status filter changes, we also want the tabs to change
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
  );
};
