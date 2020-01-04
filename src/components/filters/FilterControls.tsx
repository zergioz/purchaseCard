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
      <div className="row pb-2">
        <div className="col">
          <DirectorateFilter />
        </div>
        <div className="col-auto">
          <div className="pt-3">
            <FiscalYearFilter />
          </div>
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
