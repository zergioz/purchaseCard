import React from "react";
import { format, formatDistance, parseISO } from "date-fns";

interface IProps {
  dateISOString: string;
}
export const RequestTableDateCell = (props: IProps) => {
  const formatStr = "dd-MMM-yyyy";

  let date = parseISO(props.dateISOString);
  const formattedDate = format(date, formatStr);
  const distance = formatDistance(date, new Date(), {
    addSuffix: true
  });
  return (
    <div className="nowrap" style={{ whiteSpace: "pre" }}>
      {formattedDate.toUpperCase()}
      <br />
      <small className="text-secondary">{distance}</small>
    </div>
  );
};
