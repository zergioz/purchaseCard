import React, { useState, useContext } from "react";
import { ButtonToolbar, Button } from "react-bootstrap";
import RequestContext from "../../contexts/RequestContext";
import { PersonDirectorates as directorates } from "../../constants/PersonDirectorates";

export const DirectorateFilter: React.FC = () => {
  const context = useContext(RequestContext);
  const [currentSelection, updateCurrentSelection] = useState<string>("");
  const values = directorates;
  const handleClick = (value: string) => {
    updateCurrentSelection(value);
    context.applyFilters({ ...context.filters, directorate: value });
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
        All
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
          {value}
        </Button>
      ))}
    </ButtonToolbar>
  );
};
