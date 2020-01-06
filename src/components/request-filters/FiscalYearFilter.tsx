import React, { useState, useContext, useEffect } from "react";
import { DropdownButton, Dropdown } from "react-bootstrap";
import RequestContext from "../../contexts/RequestContext";
import { groupBy } from "../../helpers/GroupBy";
import { Request } from "../../services/models/Request";

export const FiscalYearFilter: React.FC = () => {
  const context = useContext(RequestContext);
  const [years, setYears] = useState<any[]>([]);
  const [selected, setSelected] = useState<string>(context.filters.fiscalYear);

  //filters change, update our state
  useEffect(() => {
    setSelected(context.filters.fiscalYear);
  }, [context.filters]);

  //group each request by year when the data is updated
  useEffect(() => {
    const groups = groupBy(context.requests, (request: Request) => {
      return request.approvals["j8Approval"] &&
        request.approvals["j8Approval"]!.j8FiscalYear
        ? request.approvals["j8Approval"]!.j8FiscalYear
        : "Empty";
    });
    const years = Array.from(groups.keys());
    setYears(years.sort());
  }, [context.requests]);

  //apply the FY filter when a selection is made
  useEffect(() => {
    if (context.filters.fiscalYear !== selected) {
      context.applyFilters({ ...context.filters, fiscalYear: selected }, true);
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
      key="secondary"
      id="secondary"
      size="sm"
      title={selected === "" ? `All Fiscal Years` : `Fiscal Year: ${selected}`}
    >
      {years.map(year => {
        return (
          <Dropdown.Item
            eventKey={year}
            key={`fy-${year}`}
            onClick={() => onChangeSelection(year)}
          >
            {`FY ${year}`}
          </Dropdown.Item>
        );
      })}
      <Dropdown.Divider />
      <Dropdown.Item
        eventKey="AllFiscalYears"
        onClick={() => onChangeSelection("")}
      >
        All Fiscal Years
      </Dropdown.Item>
    </DropdownButton>
  );
};
