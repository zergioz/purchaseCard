import { autoserialize, autoserializeAs } from "cerialize";
import { ApprovalActions } from "../../constants/ApprovalActions";

export type BootstrapButtonVariant =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "dark"
  | "light"
  | "outline-primary"
  | "outline-secondary"
  | "outline-success"
  | "outline-danger"
  | "outline-warning"
  | "outline-info"
  | "outline-dark"
  | "outline-light"
  | undefined;

export type BootstrapVariant =
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
  date: string;
  verb: string;
  pastTense: string;
  description: string;
  form: any;
  formInputs: { [key: string]: any };
  formInputsRequired: string[];
}

const defaultAction = { ...ApprovalActions["noop"] };

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
  date: string;

  @autoserialize
  verb: string;

  @autoserialize
  pastTense: string;

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
    this.date = data.date || defaultAction.date;
    this.verb = data.verb || defaultAction.verb;
    this.pastTense = data.pastTense || defaultAction.pastTense;
    this.description = data.description || defaultAction.description;
    this.form = data.form || defaultAction.form;
    this.formInputs = data.formInputs || defaultAction.formInputs;
    this.formInputsRequired =
      data.formInputsRequired || defaultAction.formInputsRequired;
  }
}
