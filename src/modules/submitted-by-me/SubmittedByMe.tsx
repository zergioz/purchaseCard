import React from "react";
import { RequestTable } from "../../components/request-table/RequestTable";
import { Request } from "../../services/models/Request";
import { RequestService } from "../../services/RequestService";

interface IProps {}

interface IState {
  requests?: Request[];
  loading?: boolean;
}

export class SubmittedByMe extends React.Component<IProps, IState> {
  private svc: RequestService;
  constructor(props: any) {
    super(props);
    this.state = {
      requests: [],
      loading: false
    };
    this.svc = new RequestService();
  }
  componentWillMount() {
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
        <h1>Submitted by Me</h1>
        <hr />
        <RequestTable items={this.state.requests}></RequestTable>
      </React.Fragment>
    );
  }
}
