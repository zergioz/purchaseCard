import React from "react";
import { Request } from "../../services/models/Request";

interface IProps {
  request: Request;
}
export const RequestTableRow: React.FC<IProps> = props => {
  const item: Request = props.request;
  return (
    <tr>
      <td>{item.id}</td>
      <td>{item.requestor}</td>
      <td>{item.requestField!.RequestorDirectorate}</td>
      <td>FY</td>
      <td>Qt</td>
      <td>{item.requestField!.RequestJustification}</td>
      <td>{item.status}</td>
    </tr>
  );
};
