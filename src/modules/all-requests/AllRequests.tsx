import React from "react";
import { RequestTable } from "../../components/request-table/RequestTable";
import { Request } from "../../services/models/Request";
import { RequestService } from "../../services/RequestService";
import { StepStatus } from "../../constants/StepStatus";
import { SelectorPills } from "../../components/selector-pills/SelectorPills";

const statuses: string[] = StepStatus.map(status => status.friendlyName);

interface IProps {}

interface IState {
  requests?: Request[];
  loading?: boolean;
  directorate?: string | null;
  status?: string | null;
}

export class AllRequests extends React.Component<IProps, IState> {
  private svc: RequestService;
  constructor(props: any) {
    super(props);
    this.state = { requests: [], status: null, loading: false };
    this.svc = new RequestService();
  }
  componentWillMount() {
    this.getData();
  }

  statusChanged(status: string) {
    this.setState({ ...this.state, status: status });
    this.getData();
  }

  getData() {
    this.setState({ ...this.state, loading: true });
    this.svc.read().subscribe((items: Request[]) => {
      this.setState({ ...this.state, requests: items, loading: false });
    });
  }

  render() {
    return (
      <React.Fragment>
        <h1>All Requests</h1>
        <hr />
        <SelectorPills
          values={statuses}
          onChange={(status: string) => this.statusChanged(status)}
        ></SelectorPills>
        <RequestTable items={this.state.requests}></RequestTable>
      </React.Fragment>
    );
  }
}
