import React from "react";
import { Request } from "../../services/models/Request";
import { Table } from "react-bootstrap";
import { useActionBadges } from "../approval-action-badge/ApprovalActionBadgeBar";
import { getStatusesByFriendlyName } from "../../constants/StepStatus";
import { ApprovalAction } from "../../services/models/ApprovalAction";
import { format, parseISO } from "date-fns";
interface IProps {
  request: Request;
}
export const RequestSignaturesTable = (props: IProps) => {
  const badges = useActionBadges(props.request, "auto", true, [
    "Draft",
    "Closed"
  ]);
  const statuses = Object.keys(getStatusesByFriendlyName());

  const getActions = (): Array<ApprovalAction | null> => {
    let actions: Array<ApprovalAction | null> = [];
    statuses.map(status => {
      const action = props.request.getLastActionFor(status, [
        "approve",
        "sendto",
        "reject"
      ]);
      actions.push(action);
    });
    return actions;
  };

  return (
    <>
      <Table>
        <thead>
          <tr>
            <th></th>
            <th>Step</th>
            <th>Action</th>
            <th>Date</th>
            <th>Signature</th>
            <th className="w-50">Comments</th>
          </tr>
        </thead>
        <tbody>
          {getActions().map((action: ApprovalAction | null, index: number) => {
            return (
              <tr
                hidden={!badges[index]}
                key={`sig-${props.request.id}-${index}`}
              >
                <td></td>
                <td>{badges[index]}</td>
                <td>{action ? action.pastTense : "Unsigned"}</td>
                <td>
                  {action ? format(parseISO(action.date), "dd MMM yyyy") : "-"}
                </td>
                <td>
                  {action
                    ? action.formInputs["user"]
                      ? action.formInputs["user"].Title
                      : action.formInputs["userString"]
                    : "-"}
                </td>
                <td className="w-50">
                  {action ? (
                    action.formInputs["comments"] ? (
                      action.formInputs["comments"]
                    ) : (
                      <i className="text-secondary">No comments entered</i>
                    )
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
};
