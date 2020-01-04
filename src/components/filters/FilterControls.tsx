import React from "react";
import { DirectorateFilter } from "./DirectorateFilter";
import { StatusFilter } from "./StatusFilter";
import { FiscalYearFilter } from "./FiscalYearFilter";

interface IProps {
  status?: string;
}
export const FilterControls = (props: IProps) => {
  return (
    <div className="container-fluid grey">
      <div className="row pt-2">
        <div className="col-auto btn-group">
          <DirectorateFilter />
          <FiscalYearFilter />
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <StatusFilter selected={props.status} />
        </div>
      </div>
    </div>
  );
};
