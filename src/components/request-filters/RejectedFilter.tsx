import React, { useState, useContext, useEffect } from "react";
import { Button, ButtonToolbar } from "react-bootstrap";
import RequestContext from "../../contexts/RequestContext";

export const RejectedFilter: React.FC = () => {
  const context = useContext(RequestContext);
  const [enabled, setEnabled] = useState<boolean>(true);

  //filters change, update our state
  useEffect(() => {
    setEnabled(context.filters.rejected);
  }, [context.filters]);

  //apply the filter when our state changes
  useEffect(() => {
    context.applyFilters({ ...context.filters, rejected: enabled }, true);
  }, [enabled]);

  const onChangeSelection = () => {
    if (!context.loading) {
      setEnabled(!enabled);
    }
  };

  return (
    <Button
      disabled={context.loading}
      className="m-1"
      variant={!enabled ? "outline-primary" : "primary"}
      size="sm"
      onClick={() => onChangeSelection()}
    >
      {enabled ? `Hiding Rejected` : `Showing Rejected`}
    </Button>
  );
};
