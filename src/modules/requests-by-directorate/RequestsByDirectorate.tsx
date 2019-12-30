import React from "react";
import { RequestTable } from "../../components/request-table/RequestTable";
import { Request } from "../../services/models/Request";
import { RequestService } from "../../services/RequestService";
import { SelectorPills } from "../../components/selector-pills/SelectorPills";
import { PersonDirectorates as directorates } from "../../constants/PersonDirectorates";
import { StepStatus } from "../../constants/StepStatus";

const statuses: string[] = StepStatus.map(status => status.friendlyName);

interface IProps {}

interface IState {
  requests?: Request[];
  loading?: boolean;
  directorate?: string | null;
  status?: string | null;
  update?: boolean;
}

export class RequestsByDirectorate extends React.Component<IProps, IState> {
  private svc: RequestService;
  constructor(props: any) {
    super(props);
    this.state = {
      requests: [],
      directorate: null,
      status: null,
      loading: true
    };
    this.svc = new RequestService();
  }

  componentDidMount() {
    this.getData();
  }

  directorateChanged = (directorate: string) => {
    this.setState({ ...this.state, directorate: directorate });
  };

  statusChanged = (status: string) => {
    this.setState({ ...this.state, status: status });
  };

  getData() {
    this.svc.read().subscribe((items: Request[]) => {
      this.setState({ ...this.state, requests: items, loading: false });
    });
  }

  render() {
    return (
      <React.Fragment>
        <h1>Requests by Directorate</h1>
        <hr />
        <SelectorPills
          values={directorates}
          changeHandler={this.directorateChanged}
        ></SelectorPills>
        <SelectorPills
          values={statuses}
          changeHandler={this.statusChanged}
        ></SelectorPills>
        <RequestTable items={this.state.requests}></RequestTable>
      </React.Fragment>
    );
  }
}
