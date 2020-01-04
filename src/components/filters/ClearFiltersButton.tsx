import React, { useContext } from "react";
import { Button, ButtonToolbar } from "react-bootstrap";
import RequestContext from "../../contexts/RequestContext";
import { Filters } from "./Filters";
import { FaTimes } from "react-icons/fa";

export const ClearFiltersButton: React.FC = () => {
  const context = useContext(RequestContext);
  const defaultFilters = new Filters();

  const clearFilters = () => {
    context.applyFilters(defaultFilters, true);
  };

  const areEqual = (newObj: any, prevObj: any) => {
    for (const key in newObj) {
      if (newObj[key] !== prevObj[key]) return false;
    }
    return true;
  };

  return (
    <ButtonToolbar>
      <Button
        disabled={context.loading}
        hidden={areEqual(defaultFilters, context.filters)}
        href="#/requests"
        className="m-1"
        variant="light"
        size="sm"
        onClick={() => clearFilters()}
      >
        <FaTimes style={{ marginBottom: "3px" }} /> Clear Filters
      </Button>
    </ButtonToolbar>
  );
};
