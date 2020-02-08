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
import { Request } from "../../services/models/Request";
export const StatusTable = () => {
  const context = useContext(RequestContext);
  const [model, setModel] = useState<any>([]);
  const statuses: StatusesByFriendlyName = getStatusesByFriendlyName();

  //when there's data, create the view model
  useEffect(() => {
    const counts = groupByStatus(context.requests);
    setModel(counts);
  }, [context.requests]);

  //add the totals for an array of requests
  const getTotals = (requests: Request[]): number => {
    return requests.reduce((acc, r) => acc + r.getTotal(), 0);
  };

  //format into dollar or euro value
  const formatMoney = new Request().formatAmount;

  return (
    <>
      {context.loading && <LoadingResults />}
      {!context.loading && model && model.length && (
        <Table>
          <thead>
            <tr>
              <th>Status</th>
              <th>Requests</th>
              <th>Total</th>
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
                  <td>
                    <b>
                      {formatMoney(
                        getTotals(
                          context.requests.filter(r => r.status == status)
                        )
                      )}
                    </b>
                  </td>
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
              <td>
                <b>{formatMoney(getTotals(context.requests))}</b>
              </td>
            </tr>
          </tbody>
        </Table>
      )}
    </>
  );
};
