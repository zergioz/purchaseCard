import React from "react";
import { format, formatDistance } from "date-fns";

interface IProps {
  date: Date;
}
export const RequestTableDateCell = (props: IProps) => {
  const date = format(props.date, "dd-MMM-yyyy");
  const distance = formatDistance(props.date, new Date(), { addSuffix: true });
  return (
    <div className="nowrap" style={{ whiteSpace: "pre" }}>
      {date.toUpperCase()}
      <br />
      <small className="text-secondary">{distance}</small>
    </div>
  );
};
