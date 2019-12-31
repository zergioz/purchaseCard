import React from "react";
import { SelectorPills } from "../selector-pills/SelectorPills";
import { PersonDirectorates as directorates } from "../../constants/PersonDirectorates";
import { RequestContext } from "../../contexts/RequestContext";
import { RequestsFilter } from "../requests-filter/RequestsFilter";
import { IFilters } from "../requests-filter/Filters";
import { StepStatus } from "../../constants/StepStatus";

const statuses: string[] = StepStatus.map(status => status.friendlyName);

interface IState {
  filters: IFilters;
}
interface IProps {
  filters: IFilters;
}

export class RequestTableFiltered extends React.Component<IProps, IState> {
  static contextType = RequestContext;
  constructor(props: IProps) {
    super(props);
    this.state = {
      filters: { directorate: "", status: "", ...this.props.filters }
    };
  }

  directorateChanged = (directorate: string) => {
    const filters = { ...this.state.filters, directorate: directorate };
    this.setState({ ...this.state, filters: filters });
  };

  statusChanged = (status: string) => {
    const filters = { ...this.state.filters, status: status };
    this.setState({ ...this.state, filters: filters });
  };

  render() {
    return (
      <React.Fragment>
        <SelectorPills
          values={directorates}
          changeHandler={this.directorateChanged}
        ></SelectorPills>
        <SelectorPills
          values={statuses}
          changeHandler={this.statusChanged}
        ></SelectorPills>
        <RequestsFilter filters={this.state.filters} />
      </React.Fragment>
    );
  }
}
