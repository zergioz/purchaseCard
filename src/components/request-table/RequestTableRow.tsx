import React from "react";
import { Request } from "../../services/models/Request";
export const RequestTableRow = (props: any) => {
  const item: Request = props.request;
  return (
    <tr>
      <td>{item.id}</td>
      <td>{item.requestField!.Requestor}</td>
      <td>{item.requestField!.RequestorDirectorate}</td>
      <td>FY</td>
      <td>Qt</td>
      <td>{item.requestField!.RequestJustification}</td>
      <td>{item.status}</td>
    </tr>
  );
};
