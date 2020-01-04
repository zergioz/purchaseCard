import React, { useState, useContext, useEffect } from "react";
import { Badge, Nav, DropdownButton, Dropdown } from "react-bootstrap";
import RequestContext from "../../contexts/RequestContext";
import {
  getStatusesByFriendlyName,
  groupByStatus
} from "../../constants/StepStatus";

interface IStatusFilter {
  badges: number[];
  statuses: string[];
  selected: string;
  setSelected: (status: string) => void;
}

//custom hook for status filter code, since we have more than one of them for different screen sizes
export const useStatusFilter = (): IStatusFilter => {
  const context = useContext(RequestContext);
  const [badges, setBadges] = useState<number[]>([]);
  const [selected, setSelected] = useState<string>(context.filters.status);
  const statuses: string[] = Object.keys(getStatusesByFriendlyName());

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

  const onChangeSelection = (status: string) => {
    //the filter will bounce back if they try to change it during loading, so prevent that
    if (!context.loading) {
      setSelected(status);
    }
  };

  return { badges, statuses, selected, setSelected: onChangeSelection };
};

export const StatusFilter: React.FC = () => {
  const context = useContext(RequestContext);
  const { badges, statuses, selected, setSelected } = useStatusFilter();
  return (
    <DropdownButton
      disabled={context.loading}
      className="m-1"
      variant={selected === "" ? "outline-primary" : "primary"}
      key="secondary"
      id="secondary"
      size="sm"
      title={selected === "" ? `All Statuses` : `Status: ${selected}`}
    >
      {statuses.map(value => {
        return (
          <Dropdown.Item
            eventKey={value}
            key={`status-${value}`}
            onClick={(e: any) => setSelected(value)}
          >
            {value}
          </Dropdown.Item>
        );
      })}
      <Dropdown.Divider />
      <Dropdown.Item
        eventKey="AllStatuses"
        onClick={(e: any) => setSelected("")}
      >
        All Statuses
      </Dropdown.Item>
    </DropdownButton>
  );
};
