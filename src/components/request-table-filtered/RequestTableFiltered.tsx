import React from "react";
import { SelectorPills } from "../selector-pills/SelectorPills";
import { RequestContext } from "../../contexts/RequestContext";
import { RequestsFilter } from "../requests-filter/RequestsFilter";
import { IFilters, Filters } from "../requests-filter/Filters";
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
      filters: { ...(this.props.filters || new Filters()) }
    };
  }

  componentWillReceiveProps(nextProps: IProps) {
    this.updateFilters(nextProps.filters);
  }

  updateFilters = (filters: IFilters) => {
    this.setState({ ...this.state, filters: filters });
  };

  render() {
    return (
      <React.Fragment>
        <SelectorPills
          selectedValue={this.state.filters.status}
          values={statuses}
          changeHandler={status =>
            this.updateFilters({ ...this.state.filters, status: status })
          }
        ></SelectorPills>
        <RequestsFilter filters={this.state.filters} />
      </React.Fragment>
    );
  }
}
