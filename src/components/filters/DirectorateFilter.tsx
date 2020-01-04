import React, { useState, useContext, useEffect } from "react";
import { DropdownButton, Dropdown } from "react-bootstrap";
import RequestContext from "../../contexts/RequestContext";
import { PersonDirectorates as directorates } from "../../constants/PersonDirectorates";

export const DirectorateFilter: React.FC = () => {
  const context = useContext(RequestContext);
  const [selected, updateSelected] = useState<string>(
    context.filters.directorate
  );
  const values = directorates;

  //filters change, update our state
  useEffect(() => {
    updateSelected(context.filters.directorate);
  }, [context.filters]);

  //apply the filter when our state changes
  useEffect(() => {
    if (context.filters.directorate !== selected) {
      context.applyFilters({ ...context.filters, directorate: selected }, true);
    }
  }, [selected]);

  return (
    <DropdownButton
      className="m-1"
      variant={selected === "" ? "outline-primary" : "primary"}
      key="secondary"
      id="secondary"
      size="sm"
      title={selected === "" ? `All Directorates` : `Directorate: ${selected}`}
    >
      {values.map(value => {
        return (
          <Dropdown.Item
            eventKey={value}
            key={`directorate-${value}`}
            onClick={(e: any) => updateSelected(value)}
          >
            {value}
          </Dropdown.Item>
        );
      })}
      <Dropdown.Divider />
      <Dropdown.Item
        eventKey="AllDirectorates"
        onClick={(e: any) => updateSelected("")}
      >
        All Directorates
      </Dropdown.Item>
    </DropdownButton>
  );
};
