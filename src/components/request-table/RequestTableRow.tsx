import React from "react";
import { Request } from "../../services/models/Request";
import { Link } from "react-router-dom";

interface IProps {
  request: Request;
}
export const RequestTableRow: React.FC<IProps> = props => {
  const item: Request = props.request;
  return (
    <tr>
      <td>
        <a href={`Pages/purchase_request.aspx?id=${item.id}`}>{item.id}</a>
      </td>
      <td>{item.requestField!.RequestorDirectorate}</td>
      <td>
        <a href={`mailto:${item.requestor!.EMail}`}>{`${
          item.requestor!.FirstName
        } ${item.requestor!.LastName}`}</a>
      </td>
      <td>{item.j8Approval ? item.j8Approval.j8FiscalYear : ""}</td>
      <td>{item.j8Approval ? item.j8Approval.j8Quater : ""}</td>
      <td>{item.requestField!.RequestJustification}</td>
      <td>{item.status}</td>
    </tr>
  );
};
