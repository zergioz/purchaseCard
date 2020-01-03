import React, { useState, useContext, useEffect } from "react";
import { ButtonToolbar, Button } from "react-bootstrap";
import RequestContext from "../../contexts/RequestContext";
import { PersonDirectorates as directorates } from "../../constants/PersonDirectorates";

export const DirectorateFilter: React.FC = () => {
  const context = useContext(RequestContext);
  const [selected, updateSelected] = useState<string>("");
  const values = directorates;

  useEffect(() => {
    context.applyFilters({ ...context.filters, directorate: selected }, true);
  }, [selected]);

  const spacing = { marginLeft: "0.25em", marginTop: "0.25em", width: "80px" };

  return (
    <>
      Directorate filter:
      <div className="d-flex flex-column">
        <ButtonToolbar>
          <Button
            style={spacing}
            size="sm"
            variant={selected == "" ? "primary" : "outline-secondary"}
            onClick={() => updateSelected("")}
          >
            No Filter
          </Button>
          {values.map((value: string, index: number) => (
            <Button
              key={`selector-${value}-${index}`}
              size="sm"
              style={spacing}
              variant={selected == value ? "primary" : "outline-secondary"}
              onClick={() => updateSelected(value)}
            >
              {value}
            </Button>
          ))}
        </ButtonToolbar>
      </div>
    </>
  );
};
