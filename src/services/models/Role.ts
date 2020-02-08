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

  //returns true if this person is an approver for the request in its current state
  caresAbout(request: Request): boolean {
    let cares = false;
    const step = getStatusesByFriendlyName()[request.status];
    const roles = new Set(step.approverRoles);
    const directorateMatch =
      request.requestField.RequestorDirectorate == this.directorate;
    const roleMatch = roles.has(this.role);

    switch (step.friendlyName) {
      case "Director":
      case "Billing Official":
      case "BO Final":
        cares = this.active && directorateMatch && roleMatch;
        break;
      case "Cardholder":
        cares = request.requestField.RequestorCardHolderName == this.email;
        break;
      default:
        cares = this.active && roleMatch;
        break;
    }

    return cares;
  }
}
