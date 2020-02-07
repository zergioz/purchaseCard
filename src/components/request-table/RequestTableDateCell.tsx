import React from "react";
import { format, formatDistance, parseISO } from "date-fns";
import { ErrorBoundary } from "../error-boundary/ErrorBoundary";
import { Badge, Popover, OverlayTrigger } from "react-bootstrap";

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
  const popover = (
    <Popover id="expired-popover" style={{ maxWidth: "1000px" }}>
      <Popover.Title as="h3">Request Expired</Popover.Title>
      <Popover.Content>
        The items haven't been purchased in time.
      </Popover.Content>
    </Popover>
  );
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
          <OverlayTrigger trigger="hover" placement="auto" overlay={popover}>
            <Badge variant="danger" style={{ cursor: "pointer" }}>
              Expired
            </Badge>
          </OverlayTrigger>
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
