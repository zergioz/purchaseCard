import React, { useState, useContext, useEffect } from "react";
import { Badge, Nav } from "react-bootstrap";
import RequestContext from "../../contexts/RequestContext";
import {
  getStatusesByFriendlyName,
  convertToUgly
} from "../../constants/StepStatus";
import { Request } from "../../services/models/Request";
import { groupBy } from "../../helpers/GroupBy";

const statuses: string[] = Object.keys(getStatusesByFriendlyName());

interface IProps {
  selected?: string;
  showBadgesFor?: Request[];
}
export const StatusFilter: React.FC<IProps> = props => {
  const context = useContext(RequestContext);
  const [badges, setBadges] = useState<number[]>([]);
  const [selected, setSelected] = useState<string>(
    props.selected || "Submitted"
  );

  //recreate the request count badges if the props are updated
  useEffect(() => {
    const counts = countStatusGroups();
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
  }, [selected]);

  //groups requests by status and counts them to make the badges
  const countStatusGroups = (): number[] => {
    let counts: number[] = [];
    if (props.showBadgesFor) {
      //group props.showBadgesFor by their statuses
      const groups = groupBy(
        props.showBadgesFor,
        (request: Request) => request.status
      );

      //loop through each friendly status value, convert it to the ugly version, and count the requests
      statuses.map((statusValue, index) => {
        const uglyStatusValue = convertToUgly(statusValue);
        const requestsInStatus = groups.get(uglyStatusValue);
        const count = requestsInStatus ? requestsInStatus.length : 0;
        counts[index] = count;
      });
    }
    return counts;
  };

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
