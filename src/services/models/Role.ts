import { autoserialize, autoserializeAs } from "cerialize";
import { PersonTraining } from "./PersonTraining";
import { PersonAttributes } from "./PersonAttributes";

export class Role {
  @autoserialize
  id: number;
  @autoserialize
  active: string;
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
    this.active = data.active || "NO";
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
}
