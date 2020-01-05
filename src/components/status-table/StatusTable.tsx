import React, { useEffect, useContext, useState } from "react";
import RequestContext from "../../contexts/RequestContext";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { LoadingResults } from "../request-table/LoadingResults";
import {
  getStatusesByFriendlyName,
  groupByStatus,
  StatusesByFriendlyName
} from "../../constants/StepStatus";
export const StatusTable = () => {
  const context = useContext(RequestContext);
  const [model, setModel] = useState<any>([]);
  const statuses: StatusesByFriendlyName = getStatusesByFriendlyName();

  //when there's data, create the view model
  useEffect(() => {
    const counts = groupByStatus(context.requests);
    setModel(counts);
  }, [context.requests]);

  return (
    <>
      {context.loading && <LoadingResults />}
      {!context.loading && model && model.length && (
        <Table>
          <thead>
            <tr>
              <th>Status</th>
              <th>Requests Waiting</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(statuses).map((status: string, index: number) => {
              return (
                <tr key={`status-row-${status}`}>
                  <td>
                    <Link to={`/requests/by-status/${status}`}>{status}</Link>
                  </td>
                  <td>{model[index]}</td>
                </tr>
              );
            })}
            <tr>
              <td>
                <b>All Statuses</b>
              </td>
              <td>
                <b>{context.requests.length}</b>
              </td>
            </tr>
          </tbody>
        </Table>
      )}
    </>
  );
};
