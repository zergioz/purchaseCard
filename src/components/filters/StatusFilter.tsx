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
  showBadgesFor?: Request[];
}
export const StatusFilter: React.FC<IProps> = props => {
  const context = useContext(RequestContext);
  const [badges, setBadges] = useState<number[]>([]);
  const [selected, setSelected] = useState<string>("Submitted");

  //recreate badges on props update
  useEffect(() => {
    const counts = countStatusGroups();
    setBadges(counts);
    handleClick(selected);
  }, [props.showBadgesFor]);

  const handleClick = (value: string) => {
    context.applyFilters({ ...context.filters, status: value });
    setSelected(value);
  };

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
          <Nav.Link onClick={() => handleClick(value)} eventKey={value}>
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
