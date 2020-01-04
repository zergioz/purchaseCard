import React, { useContext } from "react";
import { Button, ButtonToolbar } from "react-bootstrap";
import RequestContext from "../../contexts/RequestContext";
import { Filters } from "./Filters";

export const ClearFiltersButton: React.FC = () => {
  const context = useContext(RequestContext);

  const clearFilters = () => {
    context.applyFilters(new Filters(), true);
  };

  return (
    <ButtonToolbar>
      <Button
        disabled={context.loading}
        href="#/requests"
        className="m-1"
        variant="outline-secondary"
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
