import React from "react";
import { format, formatDistance, parseISO } from "date-fns";
import { ErrorBoundary } from "../error-boundary/ErrorBoundary";
import { Badge } from "react-bootstrap";

const formatStr = "dd MMM yyyy";
interface IProps {
  dateISOString: string;
  expired?: boolean;
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
      <small className={`${props.expired ? "text-danger" : "text-secondary"}`}>
        {distance}
      </small>
      {props.expired && (
        <>
          <br />
          <Badge variant="danger">Expired</Badge>
        </>
      )}
    </div>
  );
};

export const RequestTableDateCell = (props: IProps) => (
  <ErrorBoundary>
    <RequestTableDateCellUnsafe {...props} />
  </ErrorBoundary>
);
