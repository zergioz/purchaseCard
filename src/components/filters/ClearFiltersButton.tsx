import React, { useContext } from "react";
import { Button, ButtonToolbar } from "react-bootstrap";
import RequestContext from "../../contexts/RequestContext";
import { Filters } from "./Filters";

export const ClearFiltersButton: React.FC = () => {
  const context = useContext(RequestContext);
  const defaultFilters = new Filters();

  const clearFilters = () => {
    context.applyFilters(defaultFilters, true);
  };

  const shallowCompare = (newObj: any, prevObj: any) => {
    for (const key in newObj) {
      if (newObj[key] !== prevObj[key]) return true;
    }
    return false;
  };

  return (
    <ButtonToolbar>
      <Button
        disabled={context.loading}
        href="#/requests"
        className="m-1"
        variant={
          shallowCompare(defaultFilters, context.filters)
            ? "secondary"
            : "outline-secondary"
        }
        key="secondary"
        id="secondary"
        size="sm"
        onClick={() => clearFilters()}
      >
        Clear Filters
      </Button>
    </ButtonToolbar>
  );
};
