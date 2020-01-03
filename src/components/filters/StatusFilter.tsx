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
  defaultFilter?: string;
  showBadgesFor?: Request[];
}
export const StatusFilter: React.FC<IProps> = props => {
  const context = useContext(RequestContext);
  const defaultFilter = props.defaultFilter || context.filters.status;
  const [badges, setBadges] = useState<number[]>([]);
  const [selected, setSelected] = useState<string>(defaultFilter);

  useEffect(() => {
    setSelected(context.filters.status);
  }, [defaultFilter]);

  //recreate badges on props update
  useEffect(() => {
    const counts = countStatusGroups();
    setBadges(counts);
  }, [props]);

  const handleClick = (value: string) => {
    console.log(`StatusFilter`);
    context.applyFilters({ ...context.filters, status: value });
  };

  //groups requests by status and counts them to make the badges
  const countStatusGroups = (): number[] => {
    let counts = badges;
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
        counts[index + 1] = count;
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
            <Badge variant={!!badges[index + 1] ? badgeStyle : "light"}>
              {badges[index + 1]}
            </Badge>
          </Nav.Link>
        </Nav.Item>
      ))}
    </Nav>
  );
};
