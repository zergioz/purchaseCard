import React, { useEffect, useContext, useState } from "react";
import RequestContext from "../../contexts/RequestContext";
import { useRequestFiltering, RequestFilters } from "../filters/RequestFilters";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { PersonDirectorates as directorates } from "../../constants/PersonDirectorates";
import { Request } from "../../services/models/Request";
import { LoadingResults } from "../request-table/LoadingResults";

export const DirectorateTable = () => {
  const context = useContext(RequestContext);
  const { applyFilters } = useRequestFiltering();
  const [model, setModel] = useState<any>({});

  //when there's data, create the view model
  useEffect(() => {
    const model = createDirectorateViewModel(context.requests);
    setModel(model);
  }, [context.requests]);

  //add the totals for an array of requests
  const getTotals = (requests: Request[]): number => {
    return requests.reduce((acc, r) => acc + r.getTotal(), 0);
  };

  //format into dollar or euro value
  const formatMoney = new Request().formatAmount;

  const createDirectorateViewModel = (requests: Request[]) => {
    directorates.map(directorate => {
      const open = applyFilters(
        {
          ...new RequestFilters(),
          directorate: directorate,
          status: "All Open"
        },
        requests
      );

      const closed = applyFilters(
        { ...new RequestFilters(), directorate: directorate, status: "Closed" },
        requests
      );

      const counts = {
        open: open.length,
        openTotal: getTotals(open),
        closed: closed.length,
        closedTotal: getTotals(closed),
        all: open.length + closed.length,
        total: getTotals([...open, ...closed])
      };
      model[directorate] = counts;
    });
    return model;
  };

  const all = applyFilters(
    { ...new RequestFilters(), status: "" },
    context.requests
  );

  const allOpen = applyFilters(
    { ...new RequestFilters(), status: "All Open" },
    all
  );

  const allClosed = applyFilters(
    { ...new RequestFilters(), status: "Closed" },
    all
  );

  return (
    <>
      {context.loading && <LoadingResults />}
      {!context.loading && (
        <Table>
          <thead>
            <tr>
              <th>Directorate</th>
              <th>Open</th>
              <th>Open Total</th>
              <th>Closed</th>
              <th>Closed Total</th>
              <th>All</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {directorates.map(directorate => {
              return (
                model[directorate] && (
                  <tr key={`dir-row-${directorate}`}>
                    <td>
                      <Link to={`/requests/by-directorate/${directorate}`}>
                        {directorate}
                      </Link>
                    </td>
                    <td>{model[directorate].open}</td>
                    <td>{formatMoney(model[directorate].openTotal)}</td>
                    <td>{model[directorate].closed}</td>
                    <td>{formatMoney(model[directorate].closedTotal)}</td>
                    <td>{model[directorate].all}</td>
                    <td>{formatMoney(model[directorate].total)}</td>
                  </tr>
                )
              );
            })}
            <tr>
              <td>
                <b>All Directorates</b>
              </td>
              <td>
                <b>{allOpen.length}</b>
              </td>
              <td>{formatMoney(getTotals(allOpen))}</td>
              <td>
                <b>{allClosed.length}</b>
              </td>
              <td>{formatMoney(getTotals(allClosed))}</td>
              <td>
                <b>{all.length}</b>
              </td>
              <td>
                <b>{formatMoney(getTotals(all))}</b>
              </td>
            </tr>
          </tbody>
        </Table>
      )}
    </>
  );
};
