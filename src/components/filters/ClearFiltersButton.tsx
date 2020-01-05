import React, { useContext } from "react";
import { Button, ButtonToolbar } from "react-bootstrap";
import RequestContext from "../../contexts/RequestContext";
import { FaTimes } from "react-icons/fa";
import { areEqual } from "../../helpers/AreEqual";

export const ClearFiltersButton: React.FC = () => {
  const context = useContext(RequestContext);
  const defaultFilters = context.pageFilters;

  const clearFilters = () => {
    context.applyFilters(defaultFilters, true);
  };

  return (
    <ButtonToolbar>
      <Button
        disabled={context.loading}
        hidden={areEqual(defaultFilters, context.filters)}
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
