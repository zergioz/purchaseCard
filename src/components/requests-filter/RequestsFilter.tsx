import React from "react";
import { Request } from "../../services/models/Request";
import {
  StatusesByFriendlyName,
  getStatusesByFriendlyName,
  IStatus
} from "../../constants/StepStatus";
import {
  RequestContext,
  RequestContextType
} from "../../contexts/RequestContext";
import { RequestTable } from "../request-table/RequestTable";
import { IFilters } from "./Filters";

interface IProps {
  filters: IFilters;
}
interface IState {}

export class RequestsFilter extends React.Component<IProps, IState> {
  static contextType = RequestContext;
  private statuses: StatusesByFriendlyName;
  constructor(props: IProps, context: RequestContextType) {
    super(props);
    this.statuses = getStatusesByFriendlyName();
    context.refreshRequests();
  }

  directorateFilter = (request: Request) => {
    return (
      !this.props.filters.directorate ||
      request.requestField!.RequestorDirectorate ==
        this.props.filters.directorate
    );
  };

  requestorFilter = (request: Request) => {
    return (
      !this.props.filters.requestor ||
      request.requestor == this.props.filters.requestor
    );
  };

  statusFilter = (request: Request) => {
    return (
      !this.props.filters.status ||
      this.compareStatus(this.props.filters.status, request.status)
    );
  };

  compareStatus(friendlyStatus: any, listItemStatus: any): boolean {
    const resolvedStatus: IStatus = this.statuses[friendlyStatus];
    return listItemStatus == resolvedStatus.caseStep;
  }

  applyFilters = (): Request[] => {
    let filteredRequests: Request[] = this.context.requests;
    filteredRequests = filteredRequests
      .filter(this.requestorFilter)
      .filter(this.statusFilter)
      .filter(this.directorateFilter);
    return filteredRequests;
  };

  render() {
    const requests = this.applyFilters();
    return <RequestTable items={requests} />;
  }
}
