import { autoserialize, autoserializeAs } from "cerialize";
import { PersonTraining } from "./PersonTraining";
import { PersonAttributes } from "./PersonAttributes";
import { Request } from "./Request";
import { getStatusesByFriendlyName } from "../../constants/StepStatus";

export class Role {
  @autoserialize
  id: number;
  @autoserialize
  active: boolean;
  @autoserializeAs(PersonAttributes)
  attributes: PersonAttributes;
  @autoserialize
  directorate: string;
  @autoserialize
  email: string;
  @autoserialize
  firstName: string;
  @autoserialize
  lastName: string;
  @autoserialize
  rank: string;
  @autoserialize
  role: string;
  @autoserializeAs(PersonTraining)
  training: PersonTraining;
  @autoserialize
  pseudoName: string;

  constructor(data: any = {}) {
    this.id = data.id || 0;
    this.active = data.active === "YES" ? true : false;
    this.attributes = data.attributes || {};
    this.directorate = data.directorate || "";
    this.email = data.email || "";
    this.firstName = data.firstName || "";
    this.lastName = data.lastName || "";
    this.rank = data.rank || "";
    this.role = data.role || "";
    this.training = data.training || "";
    this.pseudoName = data.pseudoName || "";
  }

  //returns true if this person can approve the request in its current state
  caresAbout(request: Request): boolean {
    const step = getStatusesByFriendlyName()[request.status];
    const roles = new Set(step.approverRoles);
    const directorateMatch =
      request.requestField.RequestorDirectorate == this.directorate;
    const roleMatch = roles.has(this.role);
    return this.active && directorateMatch && roleMatch;
  }
}
