import React, { useState, useContext, useEffect } from "react";
import { DropdownButton, Dropdown } from "react-bootstrap";
import RequestContext from "../../contexts/RequestContext";

export const RequestTypeFilter: React.FC = () => {
  const context = useContext(RequestContext);
  const [selected, setSelected] = useState<string>(context.filters.type);
  const values = ["Technology"];

  //filters change, update our state
  useEffect(() => {
    setSelected(context.filters.type);
  }, [context.filters]);

  //apply the filter when our state changes
  useEffect(() => {
    if (context.filters.type !== selected) {
      context.applyFilters({ ...context.filters, type: selected }, true);
    }
  }, [selected]);

  const onChangeSelection = (value: string) => {
    if (!context.loading) {
      setSelected(value);
    }
  };

  return (
    <DropdownButton
      disabled={context.loading}
      className="m-1"
      variant={selected === "" ? "outline-primary" : "primary"}
      id="type-filter-button"
      size="sm"
      title={selected === "" ? `All Types` : `Type: ${selected}`}
    >
      {values.map(value => {
        return (
          <Dropdown.Item
            eventKey={value}
            key={`req-type-${value}`}
            onClick={(e: any) => onChangeSelection(value)}
          >
            {value}
          </Dropdown.Item>
        );
      })}
      <Dropdown.Divider />
      <Dropdown.Item
        eventKey="AllTypes"
        onClick={(e: any) => onChangeSelection("")}
      >
        All Types
      </Dropdown.Item>
    </DropdownButton>
  );
};
