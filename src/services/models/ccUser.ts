import { autoserialize, autoserializeAs } from "cerialize";
import { PersonTraining } from "./PersonTraining";
import { PersonAttributes } from "./PersonAttributes";

export class ccUser {
  @autoserialize
  personActive?: string;
  @autoserializeAs(PersonAttributes)
  personAttributes?: PersonAttributes;
  @autoserialize
  personDirectorate?: string;
  @autoserialize
  personEmail?: string;
  @autoserialize
  personFirstName?: string;
  @autoserialize
  personLastName?: string;
  @autoserialize
  personRank?: string;
  @autoserialize
  personRole?: string;
  @autoserializeAs(PersonTraining)
  personTraining?: PersonTraining;
  @autoserialize
  pseudoName?: string;
}
