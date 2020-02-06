import React from "react";
import { format, formatDistance, parseISO } from "date-fns";
import { ErrorBoundary } from "../error-boundary/ErrorBoundary";

const formatStr = "dd MMM yyyy";
interface IProps {
  dateISOString: string;
}

const RequestTableDateCellUnsafe = (props: IProps) => {
  if (!props.dateISOString) return null;
  let formattedDate = "";
  let distance = "";
  try {
    let date = parseISO(props.dateISOString);
    formattedDate = format(date, formatStr);
    distance = formatDistance(date, new Date(), {
      addSuffix: true
    });
  } catch (e) {
    console.error(`RequestTableDateCellUnsafe(${props.dateISOString}): `, e);
  }
  return (
    <div className="nowrap" style={{ whiteSpace: "pre" }}>
      {formattedDate}
      <br />
      <small className="text-secondary">{distance}</small>
    </div>
  );
};

export const RequestTableDateCell = (props: IProps) => (
  <ErrorBoundary>
    <RequestTableDateCellUnsafe dateISOString={props.dateISOString} />
  </ErrorBoundary>
);
