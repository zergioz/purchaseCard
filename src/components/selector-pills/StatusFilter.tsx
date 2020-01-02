import React, { useState, useContext, useEffect } from "react";
import { ButtonToolbar, Button, Badge } from "react-bootstrap";
import RequestContext from "../../contexts/RequestContext";
import {
  getStatusesByFriendlyName,
  StatusesByFriendlyName,
  convertToUgly
} from "../../constants/StepStatus";
import { Request } from "../../services/models/Request";
import { groupBy } from "../../helpers/GroupBy";

interface IProps {
  requestsToCount?: Request[];
}
export const StatusFilter: React.FC<IProps> = props => {
  const allRequestsCount = props.requestsToCount
    ? props.requestsToCount.length
    : 0;
  const context = useContext(RequestContext);
  const [currentSelection, updateCurrentSelection] = useState<string>("");
  const [badges, setBadges] = useState<number[]>([allRequestsCount]);
  const statuses: StatusesByFriendlyName = getStatusesByFriendlyName();

  const values: string[] = Object.keys(statuses);

  useEffect(() => {
    const counts = countStatusGroups();
    setBadges(counts);
  }, [props.requestsToCount]);

  const handleClick = (value: string) => {
    updateCurrentSelection(value);
    context.applyFilters({ ...context.filters, status: value });
  };

  //groups requests by status and counts them to make the badges
  const countStatusGroups = (): number[] => {
    let counts = badges;
    if (props.requestsToCount) {
      //group props.requestsToCount by their statuses
      const groups = groupBy(
        props.requestsToCount,
        (request: Request) => request.status
      );

      //loop through each friendly status value, convert it to the ugly version, and count the requests
      values.map((statusValue, index) => {
        const uglyStatusValue = convertToUgly(statusValue);
        const requestsInStatus = groups.get(uglyStatusValue);
        const count = requestsInStatus ? requestsInStatus.length : 0;
        counts[index + 1] = count;
      });
    }
    return counts;
  };

  const spacing = { marginLeft: "0.25em", marginTop: "0.25em" };
  return (
    <ButtonToolbar>
      <Button
        style={spacing}
        size="sm"
        variant={currentSelection == "" ? "danger" : "outline-danger"}
        onClick={() => handleClick("")}
      >
        All{" "}
        {!!badges && !!badges[0] && <Badge variant="light">{badges[0]}</Badge>}
      </Button>
      {values.map((value: string, index: number) => (
        <Button
          key={`selector-${value}-${index}`}
          size="sm"
          style={spacing}
          variant={
            currentSelection == value || currentSelection == ""
              ? "primary"
              : "outline-primary"
          }
          onClick={() => handleClick(value)}
        >
          {value}{" "}
          {!!badges && !!badges[index + 1] && (
            <Badge variant="light">{badges[index + 1]}</Badge>
          )}
        </Button>
      ))}
    </ButtonToolbar>
  );
};
