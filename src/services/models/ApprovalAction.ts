import { autoserialize, autoserializeAs } from "cerialize";
import { ApprovalActions } from "../../constants/ApprovalActions";

type BootstrapVariant =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "dark"
  | "light"
  | undefined;

export interface IApprovalAction {
  bootstrapClass: BootstrapVariant;
  type: string;
  actor: string;
  action: string;
  verb: string;
  description: string;
  form: any;
  formInputs: { [key: string]: any };
  formInputsRequired: string[];
}

const defaultAction = ApprovalActions["noop"];

export class ApprovalAction implements IApprovalAction {
  @autoserialize
  bootstrapClass: any;

  @autoserialize
  type: string;

  @autoserialize
  actor: string;

  @autoserialize
  action: string;

  @autoserialize
  verb: string;

  @autoserialize
  description: string;

  @autoserialize
  form: any;

  @autoserialize
  formInputs: { [key: string]: any };

  @autoserialize
  formInputsRequired: string[];

  constructor(data: any = {}) {
    this.bootstrapClass = data.bootstrapClass || defaultAction.bootstrapClass;
    this.type = data.type || defaultAction.type;
    this.actor = data.actor || defaultAction.actor;
    this.action = data.action || defaultAction.action;
    this.verb = data.verb || defaultAction.verb;
    this.description = data.description || defaultAction.description;
    this.form = data.form || defaultAction.form;
    this.formInputs = data.formInputs || defaultAction.formInputs;
    this.formInputsRequired =
      data.formInputsRequired || defaultAction.formInputsRequired;
  }
}
