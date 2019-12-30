import React from "react";
import { RequestTable } from "../../components/request-table/RequestTable";
import { Request } from "../../services/models/Request";
import { RequestService } from "../../services/RequestService";
import { DirectoratePills } from "../../components/directorate-pills/DirectoratePills";

interface IProps {}

interface IState {
  requests?: Request[];
  loading?: boolean;
  directorate?: string | null;
}

export class RequestsByDirectorate extends React.Component<IProps, IState> {
  private svc: RequestService;
  constructor(props: any) {
    super(props);
    this.state = { requests: [], directorate: null, loading: false };
    this.svc = new RequestService();
  }
  componentWillMount() {
    this.getData();
  }

  directorateChanged(directorate: string) {
    this.setState({ ...this.state, directorate: directorate });
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
        <h1>Requests by Directorate</h1>
        <hr />
        <DirectoratePills
          onChange={(directorate: string) =>
            this.directorateChanged(directorate)
          }
        ></DirectoratePills>
        <RequestTable items={this.state.requests}></RequestTable>
      </React.Fragment>
    );
  }
}
