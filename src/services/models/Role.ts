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
    this.active = data.personActive || "NO";
    this.attributes = data.personAttributes || {};
    this.directorate = data.personDirectorate || "";
    this.email = data.personEmail || "";
    this.firstName = data.personFirstName || "";
    this.lastName = data.personLastName || "";
    this.rank = data.personRank || "";
    this.role = data.personRole || "";
    this.training = data.personTraining || "";
    this.pseudoName = data.pseudoName || "";
  }
}
