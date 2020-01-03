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
      <div className="row">
        <div className="col-md-11">
          <DirectorateFilter />
        </div>
        <div className="col-md-1 p-2">
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
